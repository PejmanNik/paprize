import { describe, it, expect } from 'vitest';
import {
    AttributeValueDef,
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
});
