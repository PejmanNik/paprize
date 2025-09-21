import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest';
import { pageBreakPlugin, pageBreakAttributeName } from './pageBreakPlugin';
import type { PageElement } from '../paginate/PageNodes';
import type { PageManager } from '../paginate/PageManager';
import type { VisitContext } from '../paginate/PaginationPlugin';
import { SplitResult } from '../paginate/SplitResult';
import type { DomState } from '../paginate/DomState';

describe('pageBreakPlugin', () => {
    let mockDomState: Mocked<DomState & { currentNode: PageElement }>;
    let mockPageManager: Mocked<PageManager>;
    let mockContext: VisitContext;
    let mockElement: HTMLElement;
    const id = 'id';

    beforeEach(() => {
        mockElement = document.createElement('div');

        mockDomState = {
            currentNode: {
                getNode: vi.fn().mockReturnValue(mockElement),
            } as unknown as Mocked<PageElement>,
        } as unknown as Mocked<DomState & { currentNode: PageElement }>;

        mockPageManager = {
            markPageAsFull: vi.fn(),
        } as unknown as Mocked<PageManager>;

        mockContext = {};
    });

    describe('onVisitElement', () => {
        it('should mark page as full when page break attribute is "true"', () => {
            mockElement.setAttribute(pageBreakAttributeName, 'true');

            pageBreakPlugin.onVisitElement!(
                id,
                mockDomState,
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
                    id,
                    mockDomState,
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
                id,
                mockDomState,
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
                id,
                mockDomState,
                mockPageManager,
                mockContext
            );

            expect(mockContext.result).toBe(SplitResult.SplitChildren);
        });

        it('should override existing context result when page break is triggered', () => {
            mockContext.result = SplitResult.SplitChildren;
            mockElement.setAttribute(pageBreakAttributeName, 'true');

            pageBreakPlugin.onVisitElement!(
                id,
                mockDomState,
                mockPageManager,
                mockContext
            );

            expect(mockPageManager.markPageAsFull).toHaveBeenCalledTimes(1);
            expect(mockContext.result).toBe(SplitResult.FullNodePlaced);
        });
    });
});
