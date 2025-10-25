import { describe, expect, it } from 'vitest';
import { buildPageId, adjustDimension } from './utils';

describe('utils', () => {
    it('buildPageId should create a unique ID for each page', () => {
        const result = buildPageId('section1', 0);
        expect(result).toBe('section1-1');
    });

    describe('adjustDimension', () => {
        it('should not modify dimensions for portrait orientation', () => {
            const dimension = { width: '800px', height: '1000px' };
            const result = adjustDimension(dimension, 'portrait');
            expect(result).toEqual(dimension);
        });

        it('should swap width and height for landscape orientation', () => {
            const dimension = { width: '800px', height: '1000px' };
            const result = adjustDimension(dimension, 'landscape');
            expect(result).toEqual({ width: '1000px', height: '800px' });
        });
    });
});
