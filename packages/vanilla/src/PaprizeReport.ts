import * as Core from '@paprize/core';
import {
    jsonDataValueAttribute,
    pageContentAttribute,
    pageFooterAttribute,
    pageHeaderAttribute,
    pageIndexMetadataAttribute,
    pageNumberValueAttribute,
    previewAttribute,
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
    DomSectionContext,
    PaprizeReportEvents,
} from './PaprizeReportEvents';
import { get } from './utils';

const globalStyles = `
    [${sectionAttribute}=true] {
        display: none;
    }
`;

/**
 * Options for configuring a `PaprizeReport` instance.
 */
export interface PaprizeReportOptions {
    /**
     * Optional root element where the final paginated report will be created.
     * If not specified, `document.body` will be used as the default container.
     */
    root?: HTMLElement;

    /**
     * Determines whether to keep the original DOM elements after pagination.
     * When set to `false` (default), the original elements are removed and replaced with the paginated output.
     * When set to `true`, the original elements remain in the DOM but are marked as invisible.
     */
    keepInitialElementAfterPagination?: boolean;
}

/**
 * {@inheritDoc @paprize/core!ScheduleResult}
 */
export interface DomScheduleResult {
    /**
     * {@inheritDoc @paprize/core!ScheduleResult.sections}
     */
    sections: DomSectionContext[];

    /**
     * {@inheritDoc @paprize/core!ScheduleResult.suspension}
     */
    suspension: Promise<void>;
}

interface SectionState {
    pages: DomPageContext[];
    sectionElement: HTMLElement;
    components: Core.SectionComponents;
    options: Core.SectionOptions;
}

/**
 * {@inheritDoc @paprize/core!ReportBuilder}
 */
export class PaprizeReport {
    private readonly _sections: Map<string, SectionState> = new Map();
    private readonly _reportManager: Core.ReportBuilder;
    private readonly _monitor: Core.EventDispatcher<PaprizeReportEvents>;
    private readonly _root: HTMLElement;
    private readonly _options: PaprizeReportOptions;

    /** @public */
    constructor(options?: PaprizeReportOptions) {
        const style = document.createElement('style');
        style.textContent = globalStyles;
        document.head.appendChild(style);

        this._options = options ?? {};
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
                this._monitor.dispatch('pageCompleted', pages[event.pageIndex]);
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

        if (document.querySelector(`[${previewAttribute}]`)) {
            wrapper.classList.add(Core.previewClassName);
        }

        (this._options.root ?? document.body).appendChild(wrapper);
        return wrapper;
    }

    /**
     * {@inheritDoc @paprize/core!ReportBuilder.schedulePagination}
     */
    public async schedulePagination(): Promise<DomScheduleResult> {
        const result = await this._reportManager.schedulePagination();

        return {
            suspension: result.suspension,
            sections: result.sections.map((s) => ({
                ...s,
                pages: this._sections.get(s.sectionId)?.pages ?? [],
            })),
        };
    }

    /**
     * Monitor instance used to subscribe to pagination events.
     * See {@link PaprizeReportEvents} for available event types.
     */
    public get monitor(): Core.Monitor<PaprizeReportEvents> {
        return this._monitor;
    }

    /**
     * Registers a section by its id, specifying the page size, margins, and other options.
     * If a section with the same id already exists, the operation will be ignored.
     * @param options - Configuration options for the section.
     */
    public async addSection(
        options: Core.SectionOptions
    ): Promise<PaprizeReport> {
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
        const result = await this._reportManager.tryAddSection(
            options,
            components,
            (pageContexts) => this._renderSection(options, pageContexts)
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
            page.id = Core.buildPageId(options.id, pageContext.pageIndex);
            page.setAttribute(
                pageIndexMetadataAttribute,
                pageContext.pageIndex.toString()
            );

            Object.assign(
                page.style,
                Core.reportStyles.page(
                    options.size,
                    options.margin ?? Core.pageMargin.None
                )
            );

            const components = Core.cloneComponents(state.components);

            if (pageContext.pageIndex === 0 && components.sectionHeader) {
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
                pageContext.pageIndex === pageContexts.length - 1 &&
                components.sectionFooter
            ) {
                pageFooterContainer.appendChild(
                    components.sectionFooter.cloneNode(true)
                );
            }

            if (pageFooterContainer.children.length > 0) {
                page.appendChild(pageFooterContainer);
            }

            await this._replaceContentInfoValues(
                { ...components, pageContent },
                pageContext
            );
            state.sectionElement.appendChild(page);

            const domPageContext: DomPageContext = {
                sectionId: options.id,
                pageIndex: pageContext.pageIndex,
                totalPages: pageContexts.length,
                page,
                components: { ...components, pageContent },
            };
            pages.push(domPageContext);
        }

        this._sections.set(options.id, {
            ...state,
            pages,
        });
    }

    private async _replaceContentInfoValues(
        components: Record<string, HTMLElement | null>,
        pageContext: Core.PageContext
    ) {
        for (const component of Object.values(components)) {
            if (!component) continue;

            component
                .querySelectorAll(`[${pageNumberValueAttribute}]`)
                .forEach((el) => {
                    el.textContent = (pageContext.pageIndex + 1).toString();
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

            const jsonDataElements = component.querySelectorAll(
                `[${jsonDataValueAttribute}]`
            );

            if (jsonDataElements.length > 0) {
                const jsonData = await this._reportManager.getJsonData();
                component
                    .querySelectorAll(`[${jsonDataValueAttribute}]`)
                    .forEach((el) => {
                        const key = el.getAttribute(jsonDataValueAttribute);
                        const value = get(jsonData, key);
                        el.textContent = value ?? '';
                    });
            }
        }
    }
}
