import { defaultLayoutOptions, type LayoutOptions } from './LayoutOptions';
import type { PaginationPlugin } from './PaginationPlugin';
import { getNodeLayoutOptionsFromAttribute } from './attributes';

/**
 * Pagination options
 * @interface
 * @inlineType LayoutOptions
 */
export type PaginationOptions = Required<LayoutOptions> & {
    /**
     * Unique id of the pagination.
     */
    id: string;
    /**
     * List of plugins to use during pagination.
     */
    plugins: PaginationPlugin[];
};

export const defaultPaginationOptions: PaginationOptions = {
    id: 'default',
    plugins: [],
    ...defaultLayoutOptions,
};

export function resolvePaginationOptions(
    node: Node | null,
    globalConfig?: PaginationOptions
): PaginationOptions {
    const attributes = getNodeLayoutOptionsFromAttribute(node);

    return { ...defaultPaginationOptions, ...globalConfig, ...attributes };
}
