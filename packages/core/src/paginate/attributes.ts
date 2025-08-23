import { attributePrefix } from '../constants';

export class AttributeValueDef<T> {
    public name: string;
    public defaultValue: T;

    private _reader: (value: string) => T;

    constructor(name: string, reader: (value: string) => T, defaultValue: T) {
        this.name = name;
        this._reader = reader;
        this.defaultValue = defaultValue;
    }

    public read(value: string): T {
        return this._reader(value);
    }

    public static createStr(
        name: string,
        defaultValue: string
    ): AttributeValueDef<string> {
        return new AttributeValueDef(name, (value) => value, defaultValue);
    }
    public static createBool(
        name: string,
        defaultValue: boolean
    ): AttributeValueDef<boolean> {
        return new AttributeValueDef(
            name,
            (value) => value === 'true',
            defaultValue
        );
    }
}

const AttributeDef = {
    hyphen: AttributeValueDef.createStr('hyphen', '-'),
    keepOnSamePage: AttributeValueDef.createBool('keep-on-same-page', false),
    hyphenationEnabled: AttributeValueDef.createBool(
        'hyphenation-enabled',
        true
    ),
};

type AttributeKey = keyof typeof AttributeDef;
type AttributeValue<K extends AttributeKey> =
    (typeof AttributeDef)[K] extends AttributeValueDef<infer R> ? R : never;

export type ConfigAttribute = {
    [K in AttributeKey]?: AttributeValue<K>;
};

export const defaultConfigAttribute: Required<ConfigAttribute> =
    Object.fromEntries(
        Object.entries(AttributeDef).map(([key, configValue]) => [
            key,
            configValue.defaultValue,
        ])
    ) as Required<ConfigAttribute>;

export function getNodeConfigAttribute(node: Node | null): ConfigAttribute {
    if (!node) {
        return {};
    }

    if (!(node instanceof Element)) {
        return getNodeConfigAttribute(node?.parentNode);
    }

    const attributes: Record<string, unknown> = {};
    for (const key in AttributeDef) {
        const valueDef = AttributeDef[key as AttributeKey];
        const attrName = `${attributePrefix}${valueDef.name}`;
        const value = node.getAttribute(attrName);
        if (value !== null) {
            attributes[key] = valueDef.read(value);
        }
    }

    return attributes;
}
