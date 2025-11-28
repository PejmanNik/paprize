import type { PageManager } from './PageManager';
import type { PageElement, PageText } from './PageNodes';
import type { SplitResult } from './SplitResult';
import logger from '../logger';
import type { DomState } from './DomState';

const logPrefix = '\x1b[46mPLUGIN\x1b[0m';

export interface VisitContext {
    result?: SplitResult;
}

export interface PaginationPlugin {
    readonly name: string;
    readonly order: number;
    onVisitText?: (
        id: string,
        domState: DomState & { currentNode: PageText },
        pageManager: PageManager,
        context: VisitContext
    ) => void;
    onVisitElement?: (
        id: string,
        domState: DomState & { currentNode: PageElement },
        pageManager: PageManager,
        context: VisitContext
    ) => void;
    afterVisitNode?: (
        id: string,
        result: SplitResult,
        domState: DomState,
        pageManager: PageManager
    ) => void;
    onNewPage?: (id: string, pageManager: PageManager) => void;
    onClone?: (id: string, source: Element, cloned: PageElement) => void;
    afterPagination?: (
        id: string,
        domState: DomState,
        pageManager: PageManager
    ) => void;
}

type PluginKeys = {
    [K in keyof PaginationPlugin]: PaginationPlugin[K] extends
        | ((...args: never[]) => unknown)
        | undefined
        ? K
        : never;
}[keyof PaginationPlugin];

type PluginHookNames = NonNullable<PluginKeys>;

export function callPluginHook<T extends PluginHookNames>(
    plugins: PaginationPlugin[],
    hookName: T,
    ...args: Parameters<NonNullable<PaginationPlugin[T]>>
): void {
    plugins
        .sort((a, b) => a.order - b.order)
        .forEach((plugin) => {
            const hook = plugin[hookName];
            if (!hook) {
                return;
            }

            logger.debug(
                logPrefix,
                `executing plugin ${plugin.name}:${String(hookName)} (${String()})`,
                args
            );

            try {
                (hook as (...args: unknown[]) => void)(...args);
                logger.debug(
                    logPrefix,
                    `plugin ${plugin.name}:${String(hookName)} executed`,
                    args
                );
            } catch (error) {
                logger.debug(
                    logPrefix,
                    `plugin ${plugin.name}:${String(hookName)} failed`,
                    error
                );
            }
        });
}
