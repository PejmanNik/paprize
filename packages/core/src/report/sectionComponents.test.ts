import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cloneComponents, type SectionComponents } from './sectionComponents';

describe('cloneComponents', () => {
    function createElement(tag: string, id: string): HTMLElement {
        const el = document.createElement(tag);
        el.id = id;
        el.setAttribute('data-test', id);
        return el;
    }

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should deeply clone all HTMLElement properties', () => {
        const sectionHeader = createElement('header', 'sectionHeader');
        const sectionFooter = createElement('footer', 'sectionFooter');
        const pageHeader = createElement('header', 'pageHeader');
        const pageFooter = createElement('footer', 'pageFooter');
        const pageContent = createElement('div', 'pageContent');

        const components: SectionComponents = {
            sectionHeader,
            sectionFooter,
            pageHeader,
            pageFooter,
            pageContent,
        };

        const cloned = cloneComponents(components);

        expect(cloned).not.toBe(components);
        expect(cloned.sectionHeader).not.toBe(sectionHeader);
        expect(cloned.sectionFooter).not.toBe(sectionFooter);
        expect(cloned.pageHeader).not.toBe(pageHeader);
        expect(cloned.pageFooter).not.toBe(pageFooter);
        expect(cloned.pageContent).not.toBe(pageContent);

        expect(cloned.sectionHeader?.id).toBe('sectionHeader');
        expect(cloned.sectionFooter?.id).toBe('sectionFooter');
        expect(cloned.pageHeader?.id).toBe('pageHeader');
        expect(cloned.pageFooter?.id).toBe('pageFooter');
        expect(cloned.pageContent.id).toBe('pageContent');
    });

    it('should handle null values for optional elements', () => {
        const pageContent = createElement('div', 'pageContent');
        const components: SectionComponents = {
            sectionHeader: null,
            sectionFooter: null,
            pageHeader: null,
            pageFooter: null,
            pageContent,
        };

        const cloned = cloneComponents(components);

        expect(cloned.sectionHeader).toBeNull();
        expect(cloned.sectionFooter).toBeNull();
        expect(cloned.pageHeader).toBeNull();
        expect(cloned.pageFooter).toBeNull();
        expect(cloned.pageContent).not.toBe(pageContent);
        expect(cloned.pageContent.id).toBe('pageContent');
    });
});
