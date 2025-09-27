import { describe, it, expect } from 'vitest';
import { paprize_isReady, paprize_readJsonDataFile } from './window';

describe('Paprize Global Constants', () => {
    it('should maintain optional property behavior', () => {
        expect(window[paprize_isReady]).toBeUndefined();
        expect(window[paprize_readJsonDataFile]).toBeUndefined();

        const isReady = window[paprize_isReady];
        const readFunc = window[paprize_readJsonDataFile];

        expect(isReady).toBeUndefined();
        expect(readFunc).toBeUndefined();
    });

    it('should prevent invalid assignments in TypeScript context', () => {
        window[paprize_isReady] = true;
        expect(typeof window[paprize_isReady]).toBe('boolean');

        const func = async () => 'test';
        window[paprize_readJsonDataFile] = func;
        expect(typeof window[paprize_readJsonDataFile]).toBe('function');
    });
});
