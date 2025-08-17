import {
  getNodeConfigAttribute,
  defaultConfigAttribute,
  type ConfigAttribute,
} from "./attributes";
import type { PageElement } from "./PageNodes";

export interface PaginationPlugin {
  name: string;
  onClone: (source: Element, cloned: PageElement) => void;
}

export type PaginationConfig = ConfigAttribute & {
  plugins: PaginationPlugin[];
};

export const defaultConfig: PaginationConfig = {
  plugins: [],
  ...defaultConfigAttribute,
};

export function getConfigFromAttributes(
  node: Node | null,
  globalConfig?: PaginationConfig
): PaginationConfig {
  const attributes = getNodeConfigAttribute(node);

  return { ...attributes, plugins: [], ...globalConfig };
}

export function triggerPlugins(
  plugins: PaginationPlugin[],
  action: (plugin: PaginationPlugin) => void
) {
  plugins.forEach((plugin) => {
    action(plugin);
  });
}
