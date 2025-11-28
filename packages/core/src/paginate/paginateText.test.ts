import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest';
import { paginateTextByWord, hyphenation } from './paginateText';
import { SplitResult } from './SplitResult';
import type { PageManager } from './PageManager';
import type { PaginationOptions } from './PaginationOptions';
import type { PageText } from './PageNodes';

describe('paginateText', () => {
    let mockPageManager: Mocked<PageManager>;
    let mockConfig: PaginationOptions;
    let mockText: PageText;

    beforeEach(() => {
        vi.clearAllMocks();

        mockPageManager = {
            hasEmptySpace: vi.fn().mockReturnValue(true),
            nextPage: vi.fn(),
            addTextNode: vi.fn().mockReturnValue({ textContent: '' }),
            isOverFlow: vi.fn().mockReturnValue(false),
            startTransaction: vi.fn().mockReturnValue({
                rollback: vi.fn(),
                commit: vi.fn(),
            }),
            markPageAsFull: vi.fn(),
        } as unknown as Mocked<PageManager>;

        mockConfig = {
            hyphenationDisabled: false,
            hyphen: '-',
        } as PaginationOptions;

        mockText = {
            textContent: 'test text content',
            config: mockConfig,
        } as PageText;
    });

    describe('paginateTextByWord', () => {
        it('should handle empty text content', () => {
            mockText.textContent = '';
            const result = paginateTextByWord(mockText, mockPageManager);
            expect(result).toBe(SplitResult.FullNodePlaced);
        });

        it('should successfully paginate text that fits on one page', () => {
            mockPageManager.isOverFlow.mockReturnValue(false);
            const result = paginateTextByWord(mockText, mockPageManager);
            expect(result).toBe(SplitResult.FullNodePlaced);
        });

        it('should handle text requiring multiple pages', () => {
            mockPageManager.isOverFlow
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(false);

            const result = paginateTextByWord(mockText, mockPageManager);
            expect(mockPageManager.nextPage).toHaveBeenCalledTimes(2);
            expect(result).toBe(SplitResult.FullNodePlaced);
        });

        it('should return SplitResult.None when hyphenation is disabled and token does not fit', () => {
            mockText.config.hyphenationDisabled = true;
            mockPageManager.isOverFlow.mockReturnValue(true);

            const result = paginateTextByWord(mockText, mockPageManager);
            expect(result).toBe(SplitResult.None);
        });

        it('should handle tokens that fit directly on current page', () => {
            mockText.textContent = 'word1';
            mockPageManager.hasEmptySpace.mockReturnValue(true);
            mockPageManager.isOverFlow.mockReturnValueOnce(false); // First attempt fits

            const result = paginateTextByWord(mockText, mockPageManager);

            expect(result).toBe(SplitResult.FullNodePlaced);
            expect(mockPageManager.addTextNode).toHaveBeenCalledTimes(1);
            expect(mockPageManager.nextPage).not.toHaveBeenCalled();
        });

        it('should process pending tokens correctly after hyphenation', () => {
            mockText.textContent = 'longword';
            mockPageManager.startTransaction.mockReturnValue({
                rollback: vi.fn(),
                commit: vi.fn(),
            });

            mockPageManager.hasEmptySpace.mockImplementation(() => {
                return true;
            });

            let hasEmptySpaceCount = 0;
            mockPageManager.hasEmptySpace.mockImplementation(() => {
                hasEmptySpaceCount++;
                return hasEmptySpaceCount <= 4; // Only first 4 characters fit
            });

            let isOverflowCount = 0;
            mockPageManager.isOverFlow.mockImplementation(() => {
                isOverflowCount++;
                if (isOverflowCount === 1) return true; // First attempt overflows
                if (isOverflowCount === 2) return true; // Second attempt (full word on new page) overflows
                return false; // Rest fits (remainder "word")
            });

            const result = paginateTextByWord(mockText, mockPageManager);
            expect(result).toBe(SplitResult.FullNodePlaced);
            expect(mockPageManager.nextPage).toHaveBeenCalledTimes(1);
        });

        it('should creates a new page before hyphenation if needed', () => {
            mockText.textContent = 'longword';
            mockPageManager.startTransaction.mockReturnValue({
                rollback: vi.fn(),
                commit: vi.fn(),
            });

            mockPageManager.hasEmptySpace.mockImplementation(() => {
                return false;
            });

            let isOverflowCount = 0;
            mockPageManager.isOverFlow.mockImplementation(() => {
                isOverflowCount++;
                if (isOverflowCount === 1) return true;
                if (isOverflowCount === 2) return true;

                return false;
            });

            const result = paginateTextByWord(mockText, mockPageManager);
            expect(result).toBe(SplitResult.FullNodePlaced);

            expect(mockPageManager.nextPage).toHaveBeenCalledTimes(2);
        });
    });

    describe('hyphenation', () => {
        it('should return null when word fits completely', () => {
            mockPageManager.hasEmptySpace.mockReturnValue(true);
            const result = hyphenation('test', '-', mockPageManager);
            expect(result).toBeNull();
        });

        it('should return remainder of word when it does not fit', () => {
            let callCount = 0;
            mockPageManager.hasEmptySpace.mockImplementation(() => {
                callCount++;
                return callCount <= 2; // Only first 2 characters fit
            });

            const result = hyphenation('testing', '-', mockPageManager);
            expect(result).toBe('sting');
            expect(mockPageManager.markPageAsFull).toHaveBeenCalled();
        });

        it('should handle single character words', () => {
            mockPageManager.hasEmptySpace.mockReturnValue(true);
            const result = hyphenation('a', '-', mockPageManager);
            expect(result).toBeNull();
        });

        it('should handle word that does not fit at all', () => {
            mockPageManager.hasEmptySpace.mockReturnValue(false);
            const result = hyphenation('test', '-', mockPageManager);
            expect(result).toBe('test');
            expect(mockPageManager.markPageAsFull).toHaveBeenCalled();
        });
    });

    describe('token overflow handling', () => {
        it('should attempt to place token on new page when it overflows', () => {
            let overflowCount = 0;
            mockPageManager.isOverFlow.mockImplementation(() => {
                overflowCount++;
                return overflowCount === 1; // Overflow on first try, fit on second
            });

            const result = paginateTextByWord(mockText, mockPageManager);
            expect(mockPageManager.nextPage).toHaveBeenCalled();
            expect(result).toBe(SplitResult.FullNodePlaced);
        });

        it('should handle transaction rollback when token does not fit on new page', () => {
            const mockRollback = vi.fn();
            mockPageManager.startTransaction.mockReturnValue({
                rollback: mockRollback,
                commit: vi.fn(),
            });
            mockPageManager.isOverFlow.mockReturnValue(true);

            const result = paginateTextByWord(mockText, mockPageManager);
            expect(mockRollback).toHaveBeenCalled();
            expect(result).toBe(SplitResult.FullNodePlaced);
        });
    });
});
