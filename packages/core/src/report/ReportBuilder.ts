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
} from './utils';
import { paprize_isInitialized } from '../window';
import { globalStyleId } from '../constants';
import { PromiseTracker } from './PromiseTracker';
import logger from '../logger';

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

const logPrefix = '\x1b[43mREPORT\x1b[0m';

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

        this.injectStyle(
            reportStyles.sectionPageMedia(options.id, options.dimension)
        );
        this._monitor.dispatch('sectionCreated', context);

        return true;
    }

    public async schedulePaginate(): Promise<{
        sections: SectionContext[];
        suspension: Promise<void>;
    }> {
        await document.fonts.ready;

        const trackers: PromiseTracker[] = [];
        for (const state of this._sections.values()) {
            state.context.isPaginated = false;

            const tracker = new PromiseTracker();
            await tracker.add(state.options.suspense);
            tracker.monitor.addEventListener('onChange', (pendingCount) => {
                logger.debug(
                    logPrefix,
                    `${pendingCount} pending promises in section '${state.options.id}'.`
                );
            });

            tracker.promise.then(() => {
                logger.debug(
                    logPrefix,
                    `Start paginating section '${state.options.id}'.`
                );
                state.context.isSuspended = false;
                this.paginateSection(state);
            });

            trackers.push(tracker);
        }

        const reportTracker = new PromiseTracker();
        reportTracker.monitor.addEventListener('onComplete', () => {
            logger.debug(logPrefix, 'Report pagination completed.');
            this._monitor.dispatch('paginationCycleCompleted', {
                sections: [...this._sections.values()].map((s) => s.context),
            });
        });

        await reportTracker.add(trackers.map((t) => t.promise));
        return {
            sections: [...this._sections.values()].map((s) => s.context),
            suspension: reportTracker.promise,
        };
    }

    private injectStyle(styleContent: string) {
        let style = document.getElementById(
            globalStyleId
        ) as HTMLStyleElement | null;
        if (!style) {
            style = document.createElement('style');
            style.id = globalStyleId;
            style.textContent = '';
            document.head.appendChild(style);
        }

        style.textContent = (style.textContent + styleContent)
            .replace(/\s+/g, ' ')
            .replace(/\s*([:;{}])\s*/g, '$1')
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
            Object.assign(
                components.sectionHeader.style,
                reportStyles.component
            );
            temporarilyContainer.appendChild(components.sectionHeader);
        }
        if (components.pageHeader) {
            Object.assign(components.pageHeader.style, reportStyles.component);
            temporarilyContainer.appendChild(components.pageHeader);
        }

        Object.assign(components.pageContent.style, reportStyles.pageContent);
        temporarilyContainer.appendChild(components.pageContent);

        if (components.pageFooter) {
            Object.assign(components.pageFooter.style, reportStyles.component);
            temporarilyContainer.appendChild(components.pageFooter);
        }
        if (components.sectionFooter) {
            Object.assign(
                components.sectionFooter.style,
                reportStyles.component
            );
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
                id: state.options.id,
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
