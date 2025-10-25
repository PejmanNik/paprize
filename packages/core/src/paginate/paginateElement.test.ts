import { describe, it, expect, vi } from 'vitest';
import { paginateElementAcrossPages } from './paginateElement';
import { SplitResult } from './SplitResult';
import type { PageElement } from './PageNodes';
import type { PageManager } from './PageManager';

function createMockPageElement({
    height = 10,
    childrenCount = 0,
    keepOnSamePage = false,
} = {}): PageElement {
    return {
        getHeight: vi.fn(() => height),
        getChildrenCount: vi.fn(() => childrenCount),
        config: {
            plugins: [],
            hyphen: '',
            hyphenationEnabled: false,
            keepOnSamePage,
        },
    } as unknown as PageElement;
}

function createMockPageManager({
    emptySpace = 15,
    overflow = false,
    hasTransaction = true,
} = {}) {
    const appendedNodes: {
        node: PageElement;
        withChildren: boolean;
        clonedNode: { remove: ReturnType<typeof vi.fn> };
    }[] = [];

    return {
        appendedNodes: appendedNodes,
        hasEmptySpace: vi.fn((h) => h <= emptySpace),
        appendChild: vi.fn((node, withChildren) => {
            const clonedNode = {
                remove: vi.fn(),
            };
            appendedNodes.push({ node, withChildren, clonedNode });
            return clonedNode;
        }),
        isOverFlow: vi.fn(() => overflow),
        nextPage: vi.fn(),
        startTransaction: vi.fn(() =>
            hasTransaction
                ? {
                      rollback: vi.fn(),
                      commit: vi.fn(),
                  }
                : undefined
        ),
    } as unknown as PageManager & { appendedNodes: typeof appendedNodes };
}

describe('paginateElementAcrossPages', () => {
    it('places full node on current page if enough space', () => {
        const element = createMockPageElement();
        const pageManager = createMockPageManager({
            emptySpace: 20,
            overflow: false,
        });

        const result = paginateElementAcrossPages(element, pageManager);
        expect(result).toBe(SplitResult.FullNodePlaced);
        expect(pageManager.appendChild).toHaveBeenCalledWith(element, true);
    });

    it('places node on next page if not enough space on current but enough on next', () => {
        const element = createMockPageElement();
        const pageManager = createMockPageManager({
            emptySpace: 5,
            overflow: false,
        });

        pageManager.hasEmptySpace = vi
            .fn()
            .mockReturnValueOnce(false)
            .mockReturnValueOnce(true);

        let commitCalled = false;
        let rollbackCalled = false;
        pageManager.startTransaction = vi.fn(() => ({
            rollback: vi.fn(() => {
                rollbackCalled = true;
            }),
            commit: vi.fn(() => {
                commitCalled = true;
            }),
        }));

        const result = paginateElementAcrossPages(element, pageManager);
        expect(result).toBe(SplitResult.FullNodePlaced);
        expect(pageManager.nextPage).toHaveBeenCalled();
        expect(commitCalled).toBeTruthy();
        expect(rollbackCalled).toBeFalsy();
    });

    it('falls back to SplitChildren if only element shell can be placed', () => {
        const element = createMockPageElement({ childrenCount: 2 });
        const pageManager = createMockPageManager({
            emptySpace: 5,
            overflow: false,
        });

        // first call: not enough space for full node, second call: enough for shell
        pageManager.hasEmptySpace = vi
            .fn()
            .mockReturnValueOnce(false)
            .mockReturnValueOnce(false);

        pageManager.isOverFlow = vi
            .fn()
            .mockReturnValueOnce(false)
            .mockReturnValue(false);

        const result = paginateElementAcrossPages(element, pageManager);
        expect(result).toBe(SplitResult.SplitChildren);
        expect(pageManager.appendChild).toHaveBeenLastCalledWith(
            element,
            false
        );
    });

    it('returns None if the full element cannot be placed and has no children', () => {
        const element = createMockPageElement({ childrenCount: 0 });
        const pageManager = createMockPageManager({
            emptySpace: 5,
            overflow: false,
        });

        pageManager.hasEmptySpace = vi.fn().mockReturnValue(false);
        pageManager.isOverFlow = vi.fn().mockReturnValue(false);

        const result = paginateElementAcrossPages(element, pageManager);

        expect(result).toBe(SplitResult.None);
        expect(pageManager.appendChild).not.toHaveBeenCalled();
        expect(pageManager.nextPage).toHaveBeenCalledOnce();
    });

    it('returns None if node cannot be placed at all', () => {
        const element = createMockPageElement({ childrenCount: 2 });
        const pageManager = createMockPageManager({
            emptySpace: 5,
            overflow: true,
        });
        pageManager.hasEmptySpace = vi.fn().mockReturnValue(false);
        pageManager.isOverFlow = vi.fn(() => true);

        const result = paginateElementAcrossPages(element, pageManager);
        expect(result).toBe(SplitResult.None);
        expect(pageManager.nextPage).toHaveBeenCalledOnce();
    });

    it("returns None if keepOnSamePage is set and node can't fit", () => {
        const element = createMockPageElement({
            childrenCount: 2,
            keepOnSamePage: true,
        });
        const pageManager = createMockPageManager({
            emptySpace: 5,
            overflow: true,
        });
        // first call: not enough space for full node, second call: enough for shell
        pageManager.hasEmptySpace = vi
            .fn()
            .mockReturnValueOnce(false)
            .mockReturnValueOnce(true);

        pageManager.isOverFlow = vi
            .fn()
            .mockReturnValueOnce(true)
            .mockReturnValue(false);

        const result = paginateElementAcrossPages(element, pageManager);
        expect(result).toBe(SplitResult.None);
        expect(pageManager.nextPage).toHaveBeenCalledOnce();
    });
});
