import { isDebugMode } from '../debugUtilities/debugMode';
import { Paginator } from '../paginate/Paginator';
import { defaultPlugins } from '../plugins';
import { pageMargin } from './pageConst';
import type { Monitor } from './EventDispatcher';
import { EventDispatcher } from './EventDispatcher';
import type {
    ReportBuilderEvents,
    SectionContext,
} from './ReportBuilderEvents';
import { reportStyles } from './reportStyles';
import { cloneComponents, type SectionComponents } from './sectionComponents';
import {
    calculatePageSizes,
    createSectionPageHeightPlugin,
    jsonDataReader,
    lazyPromise,
} from './utils';
import { paprize_isInitialized, paprize_isReady } from '../window';
import { globalStyleId } from '../constants';
import { PromiseTracker } from './PromiseTracker';
import logger from '../logger';
import { adjustPageSize } from '../utils';
import type { SectionOptions } from './SectionOptions';

export interface SectionState {
    context: SectionContext;
    onPaginationCompleted: (context: SectionContext) => Promise<unknown> | void;
}

const logPrefix = '\x1b[43mREPORT\x1b[0m';

/**
 * Represents the result of a scheduled pagination process.
 */
export interface ScheduleResult {
    /**
     * List of all registered sections.
     */
    sections: SectionContext[];

    /**
     * If there are any suspended sections, this Promise tracks their state
     * and resolves only after all suspended sections have been resumed
     * and paginated.
     */
    suspension: Promise<void>;
}

/**
 * The report builder class that contains the logic for handling pagination
 * and managing the report layout.
 */
export class ReportBuilder {
    private readonly _sections: Map<string, SectionState>;
    private readonly _monitor: EventDispatcher<ReportBuilderEvents>;
    private _paginationInProgress: boolean;
    private _pendingPaginateResolvers: {
        resolve: (value: ScheduleResult) => void;
        reject: (reason?: unknown) => void;
    }[];
    private _currentAbortController: AbortController | null;

    public constructor() {
        this._sections = new Map();
        this._monitor = new EventDispatcher<ReportBuilderEvents>();
        this._paginationInProgress = false;
        this._pendingPaginateResolvers = [];
        this._currentAbortController = null;

        window[paprize_isInitialized] = true;
        this._injectStyle(reportStyles.globalStyle);
    }

    /**
     * Monitor instance used to subscribe to pagination events.
     * See {@link ReportBuilderEvents} for available event types.
     */
    public get monitor(): Monitor<ReportBuilderEvents> {
        return this._monitor;
    }

    /**
     * Removes a section from the registered sections, if it has already been registered in the report.
     */
    public removeSection(sectionId: string): void {
        this._sections.delete(sectionId);
    }

    /**
     * Registers a section by its ID, specifying the page size, margins, and other options.
     *
     * @param options - Configuration options for the section.
     * @param components - The DOM components associated with the section.
     * @param onPaginationCompleted - Callback invoked when pagination for the section is completed.
     * @returns `true` if the section was added to the report’s section list, or `false` if it already exists.
     */
    public async tryAddSection(
        options: SectionOptions,
        components: SectionComponents,
        onPaginationCompleted: SectionState['onPaginationCompleted']
    ): Promise<boolean> {
        if (this._sections.has(options.id)) {
            return false;
        }

        const context: SectionContext = {
            sectionIndex: this._sections.size,
            sectionId: options.id,
            isPaginated: false,
            isSuspended: !!options.suspense?.length,
            pages: [],
            options: {
                ...options,
                size: adjustPageSize(
                    options.size,
                    options.orientation ?? 'portrait'
                ),
            },
            components,
        };
        this._sections.set(options.id, {
            context,

            onPaginationCompleted,
        });

        this._injectStyle(
            reportStyles.sectionPageMedia(options.id, options.size)
        );

        await this._monitor.dispatch('sectionCreated', context);

        return true;
    }

    /**
     * Schedules a pagination operation.
     *
     * It is not possible to schedule multiple pagination operations in parallel,
     * as the process involves DOM manipulation, and concurrent modifications
     * could cause conflicts and unexpected results.
     * Each newly scheduled operation is queued and executed sequentially.
     * When a new pagination is scheduled, any ongoing or pending operations
     * will be aborted, and the new pagination will start immediately afterward.
     *
     * @returns A promise that resolves when the first pagination cycle is completed.
     * It does not wait for suspended sections to resolve and be paginated.
     * To wait for all sections to complete pagination, use the
     * `suspension` property of the returned result object.
     */
    public async schedulePagination(): Promise<ScheduleResult> {
        if (this._sections.size === 0) {
            window[paprize_isReady] = true;
            return {
                sections: [],
                suspension: Promise.resolve(),
            };
        }

        if (this._paginationInProgress && this._currentAbortController) {
            logger.debug(
                logPrefix,
                `Cancelling previous pagination operation.`
            );
            this._currentAbortController.abort(
                'Cancelled by new paginate call'
            );
        }

        // If pagination is still in progress, queue this request
        if (this._paginationInProgress) {
            return new Promise<ScheduleResult>((resolve, reject) => {
                this._pendingPaginateResolvers.push({ resolve, reject });
            });
        }

        return this._executePagination();
    }

    /**
     * Retrieves JSON data injected by **@paprize/puppeteer** during server-side rendering (SSR).
     *
     * If no injected data is available, the function returns the provided `defaultData`, or `null` if none is given.
     *
     * ⚠️ **Important Notes:**
     * - This function is **not type-safe** — it performs **no runtime type validation** on the returned data.
     * - It is available **only during server-side rendering** when using **@paprize/puppeteer**.
     * - When used in **client-side rendering** or **development** mode, you should provide a `defaultData` value for testing purposes.
     *
     * @template T - The expected type of the injected JSON data.
     * @param defaultData - Optional fallback value to return if no injected data is found.
     * @returns A promise resolving to the injected JSON data if available, otherwise the provided default value or `null`.
     */
    public async getJsonData<T>(defaultData?: T): Promise<T | null> {
        const json = await this._lazyJsonDataReader().catch(() => defaultData);
        return (json as T) ?? defaultData ?? null;
    }

    private _lazyJsonDataReader = lazyPromise(jsonDataReader);

    private async _executePagination(): Promise<ScheduleResult> {
        this._paginationInProgress = true;
        this._currentAbortController = new AbortController();
        const abortSignal = this._currentAbortController.signal;

        try {
            logger.debug(logPrefix, `Schedule paginate.`);

            await document.fonts.ready;
            if (abortSignal.aborted) {
                return new Promise<ScheduleResult>((resolve, reject) => {
                    this._pendingPaginateResolvers.push({ resolve, reject });
                });
            }

            const trackers: PromiseTracker[] = [];
            for (const state of this._sections.values()) {
                state.context.isPaginated = false;

                const tracker = new PromiseTracker();
                await tracker.add(state.context.options.suspense);
                tracker.monitor.addEventListener('onChange', (pendingCount) => {
                    logger.debug(
                        logPrefix,
                        `${pendingCount} pending promises in section '${state.context.sectionId}'.`
                    );
                });

                tracker.then(async () => {
                    if (abortSignal.aborted) {
                        return;
                    }

                    logger.debug(
                        logPrefix,
                        `Start paginating section '${state.context.sectionId}'.`
                    );
                    state.context.isSuspended = false;
                    await this._paginateSection(state);
                });

                trackers.push(tracker);
            }

            const reportTracker = new PromiseTracker();
            reportTracker.monitor.addEventListener('onChange', async () => {
                logger.debug(logPrefix, 'Report pagination completed.');
                await this._monitor.dispatch('paginationCycleCompleted', {
                    sections: [...this._sections.values()].map(
                        (s) => s.context
                    ),
                });
            });

            if (abortSignal.aborted) {
                return new Promise<ScheduleResult>((resolve, reject) => {
                    this._pendingPaginateResolvers.push({ resolve, reject });
                });
            }

            await reportTracker.add(trackers.map((t) => t.toPromise()));

            return {
                sections: [...this._sections.values()].map((s) => s.context),
                suspension: reportTracker.toPromise().then(() => {
                    window[paprize_isReady] = true;
                }),
            };
        } finally {
            this._processPendingPagination();
            this._paginationInProgress = false;
            this._currentAbortController = null;
        }
    }

    private async _processPendingPagination() {
        if (this._pendingPaginateResolvers.length === 0) {
            return;
        }

        logger.debug(
            logPrefix,
            `Processing ${this._pendingPaginateResolvers.length} pending paginate calls.`
        );

        const pendingResolvers = [...this._pendingPaginateResolvers];
        this._pendingPaginateResolvers = [];

        const nextResult = await this._executePagination();
        for (const resolver of pendingResolvers) {
            resolver.resolve(nextResult);
        }
    }

    private _injectStyle(styleContent: string) {
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

    private async _paginateSection(state: SectionState): Promise<void> {
        const temporarilyContainer = document.createElement('div');

        Object.assign(
            temporarilyContainer.style,
            reportStyles.page(
                state.context.options.size,
                state.context.options.margin ?? pageMargin.None
            )
        );

        if (!isDebugMode()) {
            Object.assign(temporarilyContainer.style, reportStyles.outOfScreen);
        }

        const components = cloneComponents(state.context.components);

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
            calculatePageSizes(
                components.pageContent,
                components.sectionHeader,
                components.sectionFooter
            );

        if (height === 0) {
            logger.error(
                `Pagination failed for section '${state.context.sectionId}': insufficient space for page content or content is empty. ` +
                    `Ensure that the section has content and that the header and footer do not occupy all available space.`
            );
            temporarilyContainer.remove();

            throw new Error(
                `Pagination failed: no available space for content in section '${state.context.sectionId}'.`
            );
        }

        const paginatorResult = Paginator.paginate(
            components.pageContent,
            { height, width },
            {
                id: state.context.sectionId,
                plugins: [
                    ...(state.context.options.plugins ?? defaultPlugins),
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
            pageIndex: index,
            totalPages: paginatorResult.length,
            sectionId: state.context.sectionId,
            pageContentHtml: content,
        }));

        const sectionContext: SectionContext = {
            ...state.context,
            isPaginated: true,
            isSuspended: false,
            pages: pageContexts,
        };
        this._sections.set(state.context.sectionId, {
            ...state,
            context: sectionContext,
        });

        await state.onPaginationCompleted(sectionContext);

        for (const pageContext of pageContexts) {
            await this._monitor.dispatch('pageCompleted', pageContext);
        }
        await this._monitor.dispatch('sectionCompleted', sectionContext);
    }
}
