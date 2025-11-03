import { describe, expect, it } from 'vitest';
import { buildPageId, adjustPageSize } from './utils';

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
});
