import type { PaginationPlugin } from './PaginationPlugin';
import {
    getNodeConfigAttribute,
    defaultConfigAttribute,
    type ConfigAttribute,
} from './attributes';

export type PaginationConfig = Required<ConfigAttribute> & {
    id: string;
    plugins: PaginationPlugin[];
};

export const defaultConfig: PaginationConfig = {
    id: 'default',
    plugins: [],
    ...defaultConfigAttribute,
};

export function getConfigFromAttributes(
    node: Node | null,
    globalConfig?: PaginationConfig
): PaginationConfig {
    const attributes = getNodeConfigAttribute(node);

    return { ...defaultConfig, ...globalConfig, ...attributes };
}
