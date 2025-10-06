import { isDebugMode } from '../debugUtilities/debugMode';
import type { PaginationPlugin } from '../paginate/PaginationPlugin';
import { Paginator } from '../paginate/Paginator';
import { defaultPlugins } from '../plugins';
import { pageMargin } from './pageConst';
import type { PageDimension, PageMargin } from './pageTypes';
import type { Monitor } from './EventDispatcher';
import { EventDispatcher } from './EventDispatcher';
import type {
    PageContext,
    ReportBuilderEvents,
    SectionContext,
} from './ReportBuilderEvents';
import { reportStyles } from './reportStyles';
import { cloneComponents, type SectionComponents } from './sectionComponents';
import {
    calculatePageDimensions,
    createSectionPageHeightPlugin,
    isAllResolved,
} from './utils';
import { paprize_isInitialized } from '../window';
import { globalStyleId } from '../constants';

export interface SectionOptions {
    readonly id: string;
    readonly dimension: PageDimension;
    readonly margin?: PageMargin;
    readonly plugins?: PaginationPlugin[];
    readonly suspense?: Promise<unknown>[];
}

export interface SectionState {
    options: SectionOptions;
    context: SectionContext;
    components: SectionComponents;
    onPaginationCompleted: (pages: PageContext[]) => void;
}

export class ReportBuilder {
    private readonly _sections: Map<string, SectionState>;
    private readonly _monitor: EventDispatcher<ReportBuilderEvents>;

    public constructor() {
        this._sections = new Map();
        this._monitor = new EventDispatcher<ReportBuilderEvents>();

        window[paprize_isInitialized] = true;
        this.injectStyle(reportStyles.globalStyle);
    }

    public get monitor(): Monitor<ReportBuilderEvents> {
        return this._monitor;
    }

    public tryAddSection(
        options: SectionOptions,
        components: SectionComponents,
        onPaginationCompleted: (pages: PageContext[]) => void
    ): boolean {
        if (this._sections.has(options.id)) {
            return false;
        }

        const context: SectionContext = {
            index: this._sections.size,
            sectionId: options.id,
            isPaginated: false,
            isSuspended: !!options.suspense?.length,
            pages: [],
        };
        this._sections.set(options.id, {
            context,
            options,
            components,
            onPaginationCompleted,
        });

        this.injectStyle(reportStyles.sectionPageMedia(options.id, options.dimension));
        this._monitor.dispatch('sectionCreated', context);

        return true;
    }

    public async schedulePaginate(): Promise<{
        sections: SectionContext[];
        suspension: Promise<void>;
    }> {
        await document.fonts.ready;

        const sectionPromises: Promise<void>[] = [];
        for (const state of this._sections.values()) {
            sectionPromises.push(
                Promise.all(state.options.suspense ?? []).then(() =>
                    this.paginateSection(state)
                )
            );
        }

        await this.paginationCycle(sectionPromises);

        return {
            sections: [...this._sections.values()].map((s) => s.context),
            suspension: Promise.all(sectionPromises).then(() => { }),
        };
    }

    private async paginationCycle(sectionPromises: Promise<void>[]) {
        const isCompleted = await isAllResolved(sectionPromises);
        if (!isCompleted) {
            sectionPromises.map((promise) => {
                promise.then(() => {
                    this._monitor.dispatch('paginationCycleCompleted', {
                        sections: [...this._sections.values()].map(
                            (s) => s.context
                        ),
                    });
                });
            });
        }

        this._monitor.dispatch('paginationCycleCompleted', {
            sections: [...this._sections.values()].map((s) => s.context),
        });
    }

    private injectStyle(styleContent: string) {
        let style = document.getElementById(globalStyleId) as HTMLStyleElement | null;
        if (!style) {
            style = document.createElement('style');
            style.id = globalStyleId;
            style.textContent = '';
            document.head.appendChild(style);
        }

        style.textContent = (style.textContent + styleContent).replace(/\s+/g, ' ').replace(/\s*([:;{}])\s*/g, '$1')
            .trim();
    }

    private paginateSection(state: SectionState): void {
        const temporarilyContainer = document.createElement('div');

        Object.assign(
            temporarilyContainer.style,
            reportStyles.page(
                state.options.dimension,
                state.options.margin ?? pageMargin.None
            )
        );

        if (!isDebugMode()) {
            Object.assign(temporarilyContainer.style, reportStyles.outOfScreen);
        }

        const components = cloneComponents(state.components);

        if (components.sectionHeader) {
            temporarilyContainer.appendChild(components.sectionHeader);
        }
        if (components.pageHeader) {
            temporarilyContainer.appendChild(components.pageHeader);
        }

        Object.assign(components.pageContent.style, reportStyles.pageContent);
        temporarilyContainer.appendChild(components.pageContent);

        if (components.pageFooter) {
            temporarilyContainer.appendChild(components.pageFooter);
        }
        if (components.sectionFooter) {
            temporarilyContainer.appendChild(components.sectionFooter);
        }

        document.body.appendChild(temporarilyContainer);

        const { height, width, sectionHeaderHeight, sectionFooterHeight } =
            calculatePageDimensions(
                components.pageContent,
                components.sectionHeader,
                components.sectionFooter
            );

        const paginatorResult = Paginator.paginate(
            components.pageContent,
            { height, width },
            {
                plugins: [
                    ...(state.options.plugins ?? defaultPlugins),
                    createSectionPageHeightPlugin(
                        height,
                        sectionHeaderHeight,
                        sectionFooterHeight
                    ),
                ],
            }
        );

        temporarilyContainer.remove();
        const pageContexts = paginatorResult.map((content, index) => ({
            index,
            totalPages: paginatorResult.length,
            sectionId: state.options.id,
            pageContentHtml: content,
        }));

        state.onPaginationCompleted(pageContexts);

        for (const pageContext of pageContexts) {
            this._monitor.dispatch('pageCompleted', pageContext);
        }

        const sectionContext: SectionContext = {
            ...state.context,
            isPaginated: true,
            isSuspended: false,
            pages: pageContexts,
        };
        this._sections.set(state.options.id, {
            ...state,
            context: sectionContext,
        });

        this._monitor.dispatch('sectionCompleted', sectionContext);
    }
}
