import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getTotalHeight } from './domUtilities';

function defineGlobalGetComputedStyle() {
    // Patch global getComputedStyle to return element.style values
    globalThis.getComputedStyle = (el: Element) => {
        const style = (el as HTMLElement).style as any;
        return {
            marginTop: style.marginTop || '0px',
            marginBottom: style.marginBottom || '0px',
        } as CSSStyleDeclaration;
    };
}

defineGlobalGetComputedStyle();

describe('getTotalHeight', () => {
    let element: HTMLElement;

    beforeEach(() => {
        element = document.createElement('div');
        document.body.appendChild(element);
    });

    afterEach(() => {
        document.body.removeChild(element);
    });

    it('returns the height including margins', () => {
        vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
            x: 0,
            y: 0,
            width: 100,
            height: 50,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            toJSON: () => '',
        });

        element.style.marginTop = '10px';
        element.style.marginBottom = '15px';

        expect(getTotalHeight(element)).toBe(50 + 10 + 15);
    });

    it('returns just the height if margins are zero', () => {
        vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
            x: 0,
            y: 0,
            width: 100,
            height: 40,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            toJSON: () => '',
        });
        element.style.marginTop = '0px';
        element.style.marginBottom = '0px';
        expect(getTotalHeight(element)).toBe(40);
    });
});
