import * as Core from '@paprize/core/src';
import {
    pageContentAttribute,
    pageFooterAttribute,
    pageHeaderAttribute,
    pageIndexMetadataAttribute,
    pageNumberValueAttribute,
    sectionAttribute,
    sectionFooterAttribute,
    sectionHeaderAttribute,
    sectionIdMetadataAttribute,
    sectionNumberValueAttribute,
    totalPagesValueAttribute,
    totalSectionsValueAttribute,
} from './attributes';
import type {
    DomPageContext,
    PaprizeReportEvents,
} from './PaprizeReportEvents';

const globalStyles = `
    [${sectionAttribute}=true] {
        display: none;
    }
`;

export interface PaprizeReportOptions {
    root?: HTMLElement;
    usePreviewMode?: boolean;
    keepInitialElementAfterPagination?: boolean;
}

interface SectionState {
    pages: DomPageContext[];
    sectionElement: HTMLElement;
    components: Core.SectionComponents;
    options: Core.SectionOptions;
}

export class PaprizeReport {
    private readonly _sections: Map<string, SectionState> = new Map();
    private readonly _reportManager: Core.ReportBuilder;
    private readonly _monitor: Core.EventDispatcher<PaprizeReportEvents>;
    private readonly _root: HTMLElement;
    private readonly _options: PaprizeReportOptions;

    constructor(options: PaprizeReportOptions) {
        const style = document.createElement('style');
        style.textContent = globalStyles;
        document.head.appendChild(style);

        this._options = options;
        this._monitor = new Core.EventDispatcher<PaprizeReportEvents>();
        this._reportManager = new Core.ReportBuilder();
        this._root = this._createRootElement();

        this._reportManager.monitor.addEventListener(
            'sectionCreated',
            (event) => {
                this._monitor.dispatch('sectionCreated', {
                    ...event,
                    pages: [],
                });
            }
        );
        this._reportManager.monitor.addEventListener(
            'sectionCompleted',
            (event) => {
                const pages = this._getSectionState(event.sectionId).pages;
                this._monitor.dispatch('sectionCompleted', {
                    ...event,
                    pages: pages ?? [],
                });
            }
        );
        this._reportManager.monitor.addEventListener(
            'pageCompleted',
            (event) => {
                const pages = this._getSectionState(event.sectionId).pages;
                this._monitor.dispatch('pageCompleted', pages[event.index]);
            }
        );
        this._reportManager.monitor.addEventListener(
            'paginationCycleCompleted',
            (event) => {
                this._monitor.dispatch('paginationCycleCompleted', {
                    sections: event.sections.map((s) => ({
                        ...s,
                        pages: this._sections.get(s.sectionId)?.pages ?? [],
                    })),
                });
            }
        );
    }

    _createRootElement(): HTMLElement {
        const wrapper = document.createElement('div');

        if (this._options.usePreviewMode) {
            wrapper.classList.add(Core.previewClassName);
        }

        (this._options.root ?? document.body).appendChild(wrapper);
        return wrapper;
    }

    public async schedulePaginate(): Promise<
        Awaited<ReturnType<Core.ReportBuilder['schedulePaginate']>>
    > {
        return this._reportManager.schedulePaginate();
    }

    public get monitor(): Core.Monitor<PaprizeReportEvents> {
        return this._monitor;
    }

    public addSection(options: Core.SectionOptions): PaprizeReport {
        if (this._sections.has(options.id)) {
            return this;
        }

        const section = document.getElementById(options.id);
        if (!section) {
            throw new Error(
                `Section with id ${options.id} not found in the DOM.`
            );
        }

        const components = this._getSectionComponents(section);

        // to maintain the order of sections
        const sectionElement = this._createSectionInDom(options.id);
        const result = this._reportManager.tryAddSection(
            options,
            components,
            (pageContexts) => {
                this._renderSection(options, pageContexts);
            }
        );

        if (!result) {
            this._root.removeChild(sectionElement);
            Core.logger.error(
                `Section with id ${options.id} already exists in the report manager.`
            );
            return this;
        }

        this._sections.set(options.id, {
            pages: [],
            sectionElement: sectionElement,
            components,
            options: options,
        });

        return this;
    }

    private _getSectionState(id: string): SectionState {
        const state = this._sections.get(id);
        if (!state) {
            throw new Error(`Section with id ${id} not found in the report.`);
        }

        return state;
    }

    private _createSectionInDom(sectionId: string): HTMLDivElement {
        const section = document.createElement('div');
        section.setAttribute(sectionIdMetadataAttribute, sectionId);
        section.classList.add(Core.sectionClassName);
        section.id = sectionId;
        Object.assign(section.style, Core.reportStyles.section(sectionId));

        this._root.appendChild(section);
        return section;
    }

    private _getSectionComponents(
        section: HTMLElement
    ): Core.SectionComponents {
        const pageContent = section.querySelector(
            `[${pageContentAttribute}]`
        ) as HTMLElement | undefined;
        if (!pageContent) {
            throw new Error(
                `Page content not found in section with id ${section.id}`
            );
        }

        return {
            sectionHeader: section.querySelector(
                `[${sectionHeaderAttribute}]`
            ) as HTMLElement | null,
            sectionFooter: section.querySelector(
                `[${sectionFooterAttribute}]`
            ) as HTMLElement | null,
            pageHeader: section.querySelector(
                `[${pageHeaderAttribute}]`
            ) as HTMLElement | null,
            pageFooter: section.querySelector(
                `[${pageFooterAttribute}]`
            ) as HTMLElement | null,
            pageContent: pageContent,
        };
    }

    private async _renderSection(
        options: Core.SectionOptions,
        pageContexts: Core.PageContext[]
    ) {
        const state = this._getSectionState(options.id);
        if (!this._options.keepInitialElementAfterPagination) {
            document.getElementById(options.id)?.remove();
        }
        const pages: DomPageContext[] = [];

        for (const pageContext of pageContexts) {
            const page = document.createElement('div');
            page.classList.add(Core.pageClassName);
            page.id = Core.buildPageId(options.id, pageContext.index);
            page.setAttribute(
                pageIndexMetadataAttribute,
                pageContext.index.toString()
            );

            Object.assign(
                page.style,
                Core.reportStyles.page(
                    options.dimension,
                    options.margin ?? Core.pageMargin.None
                )
            );

            const components = Core.cloneComponents(state.components);

            if (pageContext.index === 0 && components.sectionHeader) {
                page.appendChild(components.sectionHeader);
            }
            if (components.pageHeader) {
                page.appendChild(components.pageHeader);
            }

            const pageContent = document.createElement('div');
            pageContent.innerHTML = pageContext.pageContentHtml;
            page.appendChild(pageContent);

            const pageFooterContainer = document.createElement('div');
            pageFooterContainer.style.marginTop = 'auto';
            if (components.pageFooter) {
                pageFooterContainer.appendChild(components.pageFooter);
            }
            if (
                pageContext.index === pageContexts.length - 1 &&
                components.sectionFooter
            ) {
                pageFooterContainer.appendChild(
                    components.sectionFooter.cloneNode(true)
                );
            }

            if (pageFooterContainer.children.length > 0) {
                page.appendChild(pageFooterContainer);
            }

            this._replaceContentInfoValues(
                { ...components, pageContent },
                pageContext
            );
            state.sectionElement.appendChild(page);

            const domPageContext: DomPageContext = {
                sectionId: options.id,
                index: pageContext.index,
                totalPages: pageContexts.length,
                ...components,
                page,
                pageContent,
            };
            pages.push(domPageContext);
        }

        this._sections.set(options.id, {
            ...state,
            pages,
        });
    }

    private _replaceContentInfoValues(
        components: Record<string, HTMLElement | null>,
        pageContext: Core.PageContext
    ) {
        for (const component of Object.values(components)) {
            if (!component) continue;

            component
                .querySelectorAll(`[${pageNumberValueAttribute}]`)
                .forEach((el) => {
                    el.textContent = (pageContext.index + 1).toString();
                });
            component
                .querySelectorAll(`[${totalPagesValueAttribute}]`)
                .forEach((el) => {
                    el.textContent = pageContext.totalPages.toString();
                });
            component
                .querySelectorAll(`[${sectionNumberValueAttribute}]`)
                .forEach((el) => {
                    el.textContent = (
                        Array.from(this._sections.keys()).indexOf(
                            pageContext.sectionId
                        ) + 1
                    ).toString();
                });
            component
                .querySelectorAll(`[${totalSectionsValueAttribute}]`)
                .forEach((el) => {
                    el.textContent = this._sections.size.toString();
                });
        }
    }
}
