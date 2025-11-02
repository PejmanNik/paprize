import { describe, it, expect } from 'vitest';
import {
    getNodeLayoutOptionsFromAttribute,
    layoutOptionsToAttributes,
} from './attributes';

describe('getNodeLayoutOptionsFromAttribute', () => {
    it('should return empty config for null node', () => {
        expect(getNodeLayoutOptionsFromAttribute(null)).toEqual({});
    });

    it('should skip invalid attributes', () => {
        const element = document.createElement('div');
        element.setAttribute('data-pz-z', 'y');
        expect(getNodeLayoutOptionsFromAttribute(element)).toMatchObject({});
    });

    it('should return empty config for non-Element node without parent', () => {
        const textNode = document.createTextNode('text');
        expect(getNodeLayoutOptionsFromAttribute(textNode)).toEqual({});
    });

    it('should return attributes from parent for non-Element node', () => {
        const parent = document.createElement('div');
        parent.setAttribute('data-pz-hyphen', 'y');
        const child = document.createTextNode('child');
        parent.appendChild(child);
        expect(getNodeLayoutOptionsFromAttribute(child)).toMatchObject({
            hyphen: 'y',
        });
    });

    it('should read attributes from an element', () => {
        const el = document.createElement('div');
        el.setAttribute('data-pz-hyphen', 'x');
        el.setAttribute('data-pz-keep-on-same-page', 'true');
        el.setAttribute('data-pz-hyphenation-disabled', 'false');
        const config = getNodeLayoutOptionsFromAttribute(el);
        expect(config.hyphen).toBe('x');
        expect(config.keepOnSamePage).toBe(true);
        expect(config.hyphenationDisabled).toBe(false);
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
        grandparentElement.setAttribute(
            'data-pz-hyphenation-disabled',
            'false'
        );
        parentElement.setAttribute('data-pz-hyphen', 'p');
        parentElement.setAttribute('data-pz-hyphenation-disabled', 'true');
        childElement.setAttribute('data-pz-hyphen', 'c');

        getNodeLayoutOptionsFromAttribute(grandparentElement);
        getNodeLayoutOptionsFromAttribute(parentElement);
        const result = getNodeLayoutOptionsFromAttribute(childElement);

        expect(result).toEqual({
            keepOnSamePage: false, // inherited from grandparent
            hyphenationDisabled: true, // inherited from parent
            hyphen: 'c', // child's own
        });
    });
});

describe('layoutOptionsToAttributes', () => {
    it('should convert config object to attribute map with correct prefix and string values', () => {
        const config = {
            hyphen: 'foo',
            keepOnSamePage: true,
            hyphenationDisabled: false,
        };
        const result = layoutOptionsToAttributes(config);
        expect(result).toEqual({
            'data-pz-hyphen': 'foo',
            'data-pz-keep-on-same-page': 'true',
            'data-pz-hyphenation-disabled': 'false',
        });
    });

    it('should skip undefined values', () => {
        const config = {
            hyphen: undefined,
            keepOnSamePage: true,
        };
        const result = layoutOptionsToAttributes(config);
        expect(result).toEqual({
            'data-pz-keep-on-same-page': 'true',
        });
    });

    it('should return an empty object for empty config', () => {
        const result = layoutOptionsToAttributes({});
        expect(result).toEqual({});
    });
});
