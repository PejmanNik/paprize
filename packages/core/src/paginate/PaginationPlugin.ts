import type { PageManager, PageState } from './PageManager';
import type { PageElement, PageText } from './PageNodes';
import type { SplitResult } from './SplitResult';
import logger from 'loglevel';

const logPrefix = '\x1b[46mPLUGIN\x1b[0m';

export interface VisitContext {
    result?: SplitResult;
}

export interface PaginationPlugin {
    readonly name: string;

    onVisitText?: (
        currentNode: PageText,
        pageManager: PageManager,
        context: VisitContext
    ) => void;
    onVisitElement?: (
        currentNode: PageElement,
        pageManager: PageManager,
        context: VisitContext
    ) => void;
    onNewPage?: (newPageState: PageState) => void;
    onClone?: (source: Element, cloned: PageElement) => void;
}

type PluginKeys = {
    [K in keyof PaginationPlugin]: PaginationPlugin[K] extends
        | ((...args: any[]) => any)
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
    plugins.forEach((plugin) => {
        const hook = plugin[hookName];
        if (!hook) {
            return;
        }

        logger.info(
            logPrefix,
            `executing plugin ${plugin.name}:${String(hookName)}`,
            args
        );

        try {
            (hook as Function)(...args);
            logger.info(
                logPrefix,
                `plugin ${plugin.name}:${String(hookName)} executed`,
                args
            );
        } catch (error) {
            logger.error(
                logPrefix,
                `plugin ${plugin.name}:${String(hookName)} failed`,
                error
            );
        }
    });
}
