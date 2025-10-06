import { describe, expect, it } from "vitest";
import { buildPageId } from "./utils";

describe('utils', () => {
    it('buildPageId should create a unique ID for each page', () => {
        const result = buildPageId('section1', 0);
        expect(result).toBe('section1-1');
    });
});