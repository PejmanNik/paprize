import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest';
import { pageBreakPlugin, pageBreakAttributeName } from './pageBreakPlugin';
import type { PageElement } from '../paginate/PageNodes';
import type { PageManager } from '../paginate/PageManager';
import type { VisitContext } from '../paginate/PaginationPlugin';
import { SplitResult } from '../paginate/SplitResult';

describe('pageBreakPlugin', () => {
    let mockPageElement: Mocked<PageElement>;
    let mockPageManager: Mocked<PageManager>;
    let mockContext: VisitContext;
    let mockElement: HTMLElement;

    beforeEach(() => {
        mockElement = document.createElement('div');

        mockPageElement = {
            getNode: vi.fn().mockReturnValue(mockElement),
        } as unknown as Mocked<PageElement>;

        mockPageManager = {
            markPageAsFull: vi.fn(),
        } as unknown as Mocked<PageManager>;

        mockContext = {};
    });

    describe('onVisitElement', () => {
        it('should mark page as full when page break attribute is "true"', () => {
            mockElement.setAttribute(pageBreakAttributeName, 'true');

            pageBreakPlugin.onVisitElement!(
                mockPageElement,
                mockPageManager,
                mockContext
            );

            expect(mockPageManager.markPageAsFull).toHaveBeenCalledTimes(1);
            expect(mockContext.result).toBe(SplitResult.FullNodePlaced);
        });

        it.for(['false', 'something'])(
            'should not mark page as full when page break attribute is "%s"',
            (value) => {
                mockElement.setAttribute(pageBreakAttributeName, value);

                pageBreakPlugin.onVisitElement!(
                    mockPageElement,
                    mockPageManager,
                    mockContext
                );

                expect(mockPageManager.markPageAsFull).not.toHaveBeenCalled();
                expect(mockContext.result).toBeUndefined();
            }
        );

        it('should not mark page as full when page break attribute is not set', () => {
            mockElement.removeAttribute(pageBreakAttributeName);
            pageBreakPlugin.onVisitElement!(
                mockPageElement,
                mockPageManager,
                mockContext
            );

            expect(mockPageManager.markPageAsFull).not.toHaveBeenCalled();
            expect(mockContext.result).toBeUndefined();
        });

        it('should preserve existing context properties when page break is not triggered', () => {
            mockContext.result = SplitResult.SplitChildren;
            mockElement.setAttribute(pageBreakAttributeName, 'false');

            pageBreakPlugin.onVisitElement!(
                mockPageElement,
                mockPageManager,
                mockContext
            );

            expect(mockContext.result).toBe(SplitResult.SplitChildren);
        });

        it('should override existing context result when page break is triggered', () => {
            mockContext.result = SplitResult.SplitChildren;
            mockElement.setAttribute(pageBreakAttributeName, 'true');

            pageBreakPlugin.onVisitElement!(
                mockPageElement,
                mockPageManager,
                mockContext
            );

            expect(mockPageManager.markPageAsFull).toHaveBeenCalledTimes(1);
            expect(mockContext.result).toBe(SplitResult.FullNodePlaced);
        });
    });
});
