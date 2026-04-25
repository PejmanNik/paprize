import { describe, expect, it } from 'vitest';
import { buildPageId, adjustPageSize, pageNodeToString } from './utils';
import type { PageNode } from './paginate/PageNodes';

describe('utils', () => {
    it('buildPageId should create a unique ID for each page', () => {
        const result = buildPageId('section1', 0);
        expect(result).toBe('section1-1');
    });

    describe('adjustPageSize', () => {
        it('should not modify size for portrait orientation', () => {
            const size = { width: '800px', height: '1000px' };
            const result = adjustPageSize(size, 'portrait');
            expect(result).toEqual(size);
        });

        it('should swap width and height for landscape orientation', () => {
            const size = { width: '800px', height: '1000px' };
            const result = adjustPageSize(size, 'landscape');
            expect(result).toEqual({ width: '1000px', height: '800px' });
        });
    });

    describe('pageNodeToString', () => {
        it('should return undefined for null node', () => {
            expect(pageNodeToString(null)).toBe('undefined');
        });

        it('should stringify and truncate non-element nodes', () => {
            const longValue = 'x'.repeat(120);
            const node = {
                getNode: () => longValue,
            } as unknown as PageNode;

            expect(pageNodeToString(node)).toBe('x'.repeat(100));
        });

        it('should include tag, id, and classes for element nodes', () => {
            const el = document.createElement('section');
            el.id = 'summary';
            el.classList.add('page', 'active');
            const node = {
                getNode: () => el,
            } as unknown as PageNode;

            expect(pageNodeToString(node)).toBe(
                '<section#summary.page.active>'
            );
        });

        it('should only include tag for plain elements', () => {
            const el = document.createElement('p');
            const node = {
                getNode: () => el,
            } as unknown as PageNode;

            expect(pageNodeToString(node)).toBe('<p>');
        });
    });
});
