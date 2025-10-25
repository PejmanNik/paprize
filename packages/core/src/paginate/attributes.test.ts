import { describe, it, expect } from 'vitest';
import {
    AttributeValueDef,
    configToAttributes,
    defaultConfigAttribute,
    getNodeConfigAttribute,
} from './attributes';

describe('AttributeValueDef', () => {
    it('should read string values correctly', () => {
        const def = AttributeValueDef.createStr('test', 'default');
        expect(def.read('foo')).toBe('foo');
        expect(def.defaultValue).toBe('default');
    });

    it('should read boolean values correctly', () => {
        const def = AttributeValueDef.createBool('test', true);
        expect(def.read('true')).toBe(true);
        expect(def.read('false')).toBe(false);
        expect(def.defaultValue).toBe(true);
    });
});

describe('defaultConfigAttribute', () => {
    it('should have correct default values', () => {
        expect(defaultConfigAttribute.hyphen).toBe('-');
    });
});

describe('getNodeConfigAttribute', () => {
    it('should return empty config for null node', () => {
        expect(getNodeConfigAttribute(null)).toEqual({});
    });

    it('should return empty config for non-Element node without parent', () => {
        const textNode = document.createTextNode('text');
        expect(getNodeConfigAttribute(textNode)).toEqual({});
    });

    it('should return attributes from parent for non-Element node', () => {
        const parent = document.createElement('div');
        parent.setAttribute('data-pz-hyphen', 'y');
        const child = document.createTextNode('child');
        parent.appendChild(child);
        expect(getNodeConfigAttribute(child)).toMatchObject({ hyphen: 'y' });
    });

    it('should read attributes from an element', () => {
        const el = document.createElement('div');
        el.setAttribute('data-pz-hyphen', 'x');
        el.setAttribute('data-pz-keep-on-same-page', 'true');
        el.setAttribute('data-pz-hyphenation-enabled', 'false');
        const config = getNodeConfigAttribute(el);
        expect(config.hyphen).toBe('x');
        expect(config.keepOnSamePage).toBe(true);
        expect(config.hyphenationEnabled).toBe(false);
    });

    it('should handle deep nesting of parent attributes', () => {
        const grandparentElement = document.createElement('div');
        const parentElement = document.createElement('div');
        const childElement = document.createElement('div');

        grandparentElement.appendChild(parentElement);
        parentElement.appendChild(childElement);

        // Set attributes at different levels
        grandparentElement.setAttribute('data-pz-hyphen', 'gp');
        grandparentElement.setAttribute('data-pz-keep-on-same-page', 'false');
        grandparentElement.setAttribute('data-pz-hyphenation-enabled', 'false');
        parentElement.setAttribute('data-pz-hyphen', 'p');
        parentElement.setAttribute('data-pz-hyphenation-enabled', 'true');
        childElement.setAttribute('data-pz-hyphen', 'c');

        getNodeConfigAttribute(grandparentElement);
        getNodeConfigAttribute(parentElement);
        const result = getNodeConfigAttribute(childElement);

        expect(result).toEqual({
            keepOnSamePage: false, // inherited from grandparent
            hyphenationEnabled: true, // inherited from parent
            hyphen: 'c', // child's own
        });
    });
});

describe('configToAttributes', () => {
    it('should convert config object to attribute map with correct prefix and string values', () => {
        const config = {
            hyphen: 'foo',
            keepOnSamePage: true,
            hyphenationEnabled: false,
        };
        const result = configToAttributes(config);
        expect(result).toEqual({
            'data-pz-hyphen': 'foo',
            'data-pz-keep-on-same-page': 'true',
            'data-pz-hyphenation-enabled': 'false',
        });
    });

    it('should skip undefined values', () => {
        const config = {
            hyphen: undefined,
            keepOnSamePage: true,
        };
        const result = configToAttributes(config);
        expect(result).toEqual({
            'data-pz-keep-on-same-page': 'true',
        });
    });

    it('should return an empty object for empty config', () => {
        const result = configToAttributes({});
        expect(result).toEqual({});
    });
});
