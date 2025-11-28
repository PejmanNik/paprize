import { attributePrefix } from '../constants';
import { defaultLayoutOptions, type LayoutOptions } from './LayoutOptions';

type LayoutOptionsAttributes = {
    [Key in keyof Required<LayoutOptions>]: {
        key: string;
        reader: (value: unknown) => LayoutOptions[Key];
    };
};

export const layoutOptionHyphenAttribute = `${attributePrefix}hyphen`;
export const layoutOptionKeepOnSamePageAttribute = `${attributePrefix}keep-on-same-page`;
export const layoutOptionHyphenationDisabledAttribute = `${attributePrefix}hyphenation-disabled`;

const layoutOptionsAttributes: LayoutOptionsAttributes = {
    hyphen: {
        key: layoutOptionHyphenAttribute,
        reader: (value) => String(value),
    },
    keepOnSamePage: {
        key: layoutOptionKeepOnSamePageAttribute,
        reader: (value) => value === 'true',
    },
    hyphenationDisabled: {
        key: layoutOptionHyphenationDisabledAttribute,
        reader: (value) => value === 'true',
    },
};

export function layoutOptionsToAttributes(
    config: LayoutOptions
): Record<string, string> {
    const map: Record<string, string> = {};
    for (const [key, value] of Object.entries(config)) {
        const attribute = layoutOptionsAttributes[key as keyof LayoutOptions];
        if (attribute !== undefined && value !== undefined) {
            map[attribute.key] = String(value);
        }
    }
    return map;
}

const attributeCache = new WeakMap<Node, LayoutOptions>();

function assignAttribute<K extends keyof LayoutOptions>(
    key: K,
    reader: (value: unknown) => LayoutOptions[K],
    value: string | null,
    attributes: LayoutOptions
) {
    if (value == null) {
        return;
    }

    const parsedValue = reader(value);
    if (parsedValue !== undefined) {
        attributes[key] = parsedValue;
    }
}

export function getNodeLayoutOptionsFromAttribute(
    node: Node | null
): Partial<LayoutOptions> {
    if (!node) {
        return {};
    }

    if (!(node instanceof Element)) {
        return getNodeLayoutOptionsFromAttribute(node?.parentNode);
    }

    const attributes: Partial<LayoutOptions> = {};
    for (const key of Object.keys(defaultLayoutOptions)) {
        const typedKey = key as keyof LayoutOptions;
        const attribute = layoutOptionsAttributes[typedKey];

        const value = node.getAttribute(attribute.key);
        assignAttribute(typedKey, attribute.reader, value, attributes);
    }

    // each node inherits attributes from its ancestors
    // since the DOM tree is traversed from top to bottom,
    // the parent attributes have already been read.
    const parentAttributes = node.parentNode
        ? attributeCache.get(node.parentNode)
        : undefined;

    const result = { ...parentAttributes, ...attributes };
    attributeCache.set(node, result);

    return result;
}
