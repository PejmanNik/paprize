import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OrderedListPlugin } from './OrderedListPlugin';
import type { PageManager } from '../paginate/PageManager';
import type { PageElement } from '../paginate/PageNodes';
import type { DomState } from '../paginate/DomState';
import { SplitResult } from '../paginate/SplitResult';

function createPageElement({
    node,
    originalNode = node,
    cloneCount = 0,
    clonedFrom,
}: {
    node: Element;
    originalNode?: Element;
    cloneCount?: number;
    clonedFrom?: PageElement;
}): PageElement {
    return {
        config: {},
        transaction: {},
        clonedData: {
            cloneCount,
            clonedFrom,
        },
        getNode: vi.fn().mockReturnValue(node),
        getOriginalNode: vi.fn().mockReturnValue(originalNode),
        appendChild: vi.fn(),
    } as unknown as PageElement;
}

function createPageManager(currentElement: PageElement): PageManager {
    return {
        getPageState: vi.fn().mockReturnValue({
            currentElement,
        }),
    } as unknown as PageManager;
}

describe('OrderedListPlugin', () => {
    const id = 'id';
    let plugin: OrderedListPlugin;

    beforeEach(() => {
        plugin = new OrderedListPlugin();
    });

    describe('onClone', () => {
        it('should return early for non LI element', () => {
            const divElement = { tagName: 'DIV' } as Element;
            const cloned = createPageElement({
                node: document.createElement('li'),
                cloneCount: 2,
            });

            plugin.onClone(id, divElement, cloned);

            expect(cloned.getNode).not.toHaveBeenCalled();
        });

        it('should return early for LI that is not split across pages', () => {
            const source = document.createElement('li');
            const cloned = createPageElement({
                node: document.createElement('li'),
                cloneCount: 1,
            });

            plugin.onClone(id, source, cloned);

            expect(cloned.getNode).not.toHaveBeenCalled();
        });

        it('should hide numbering and return when parent lists are invalid', () => {
            const run = (
                sourceParent: Element | null,
                originalParent: Element | null
            ) => {
                const sourceItem = document.createElement('li');
                if (sourceParent) {
                    sourceParent.appendChild(sourceItem);
                }

                const originalItem = document.createElement('li');
                if (originalParent) {
                    originalParent.appendChild(originalItem);
                }

                const sourcePageElement = createPageElement({
                    node: sourceItem,
                });
                const clonedItem = document.createElement('li');
                const cloned = createPageElement({
                    node: clonedItem,
                    originalNode: originalItem,
                    cloneCount: 2,
                    clonedFrom: sourcePageElement,
                });

                plugin.onClone(id, sourceItem, cloned);

                expect(clonedItem.style.listStyleType).toBe('none');
            };

            run(null, document.createElement('ol'));
            run(document.createElement('ol'), null);
            run(document.createElement('div'), document.createElement('ol'));
            run(document.createElement('ol'), document.createElement('div'));
        });

        it('should decrement rendered count for duplicated split list item', () => {
            const originalList = document.createElement('ol');
            originalList.start = 4;

            const previousList = document.createElement('ol');
            previousList.appendChild(document.createElement('li'));
            previousList.appendChild(document.createElement('li'));

            const previousListPageElement = createPageElement({
                node: previousList,
                originalNode: originalList,
            });

            plugin.afterVisitNode(
                id,
                SplitResult.SplitChildren,
                {} as DomState,
                createPageManager(previousListPageElement)
            );

            const originalItem = document.createElement('li');
            originalList.appendChild(originalItem);

            const previousItem = previousList.children[0] as HTMLLIElement;
            const previousItemPageElement = createPageElement({
                node: previousItem,
            });

            const clonedItem = document.createElement('li');
            const clonedItemPageElement = createPageElement({
                node: clonedItem,
                originalNode: originalItem,
                cloneCount: 2,
                clonedFrom: previousItemPageElement,
            });

            plugin.onClone(id, originalItem, clonedItemPageElement);

            const nextList = document.createElement('ol');
            const nextListPageElement = createPageElement({
                node: nextList,
                originalNode: originalList,
            });
            plugin.afterVisitNode(
                id,
                SplitResult.SplitChildren,
                {} as DomState,
                createPageManager(nextListPageElement)
            );

            expect(clonedItem.style.listStyleType).toBe('none');
            expect(nextList.start).toBe(5);
        });
    });

    describe('afterVisitNode', () => {
        it('should return early for non OL element', () => {
            const divPageElement = createPageElement({
                node: document.createElement('div'),
            });

            plugin.afterVisitNode(
                id,
                SplitResult.SplitChildren,
                {} as DomState,
                createPageManager(divPageElement)
            );

            expect(divPageElement.getOriginalNode).not.toHaveBeenCalled();
        });

        it('should shift ordered list start and count only LI children', () => {
            const originalList = document.createElement('ol');
            originalList.start = 2;

            const firstClone = document.createElement('ol');
            firstClone.appendChild(document.createElement('li'));
            firstClone.appendChild(document.createElement('li'));
            firstClone.appendChild(document.createElement('div'));

            const firstClonePageElement = createPageElement({
                node: firstClone,
                originalNode: originalList,
            });

            plugin.afterVisitNode(
                id,
                SplitResult.SplitChildren,
                {} as DomState,
                createPageManager(firstClonePageElement)
            );

            const secondClone = document.createElement('ol');
            secondClone.appendChild(document.createElement('li'));
            secondClone.appendChild(document.createElement('span'));

            const secondClonePageElement = createPageElement({
                node: secondClone,
                originalNode: originalList,
            });

            plugin.afterVisitNode(
                id,
                SplitResult.SplitChildren,
                {} as DomState,
                createPageManager(secondClonePageElement)
            );

            expect(firstClone.start).toBe(2);
            expect(secondClone.start).toBe(4);
        });

        it('should clear tracked counts before pagination', () => {
            const originalList = document.createElement('ol');
            originalList.start = 7;

            const firstClone = document.createElement('ol');
            firstClone.appendChild(document.createElement('li'));

            const firstClonePageElement = createPageElement({
                node: firstClone,
                originalNode: originalList,
            });

            plugin.afterVisitNode(
                id,
                SplitResult.SplitChildren,
                {} as DomState,
                createPageManager(firstClonePageElement)
            );

            plugin.beforePagination();

            const secondClone = document.createElement('ol');
            const secondClonePageElement = createPageElement({
                node: secondClone,
                originalNode: originalList,
            });

            plugin.afterVisitNode(
                id,
                SplitResult.SplitChildren,
                {} as DomState,
                createPageManager(secondClonePageElement)
            );

            expect(secondClone.start).toBe(7);
        });
    });
});
