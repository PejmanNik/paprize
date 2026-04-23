import type { DomState } from '../paginate/DomState';
import type { PageManager } from '../paginate/PageManager';
import type { PageElement, SafeElement } from '../paginate/PageNodes';
import type { PaginationPlugin } from '../paginate/PaginationPlugin';
import { SplitResult } from '../paginate/SplitResult';

export class OrderedListPlugin implements PaginationPlugin {
    // original list -> (clone list -> count of items rendered in the clone)
    private _originalItemCount: Map<
        HTMLOListElement,
        Map<HTMLOListElement, number>
    > = new Map();

    name = 'orderedList';
    order = 1;
    onClone = (_id: string, source: Element, cloned: PageElement) => {
        if (!this._isListItem(source)) return;

        const isSpreadAcrossPages = cloned.clonedData.cloneCount > 1;
        if (!isSpreadAcrossPages) return;

        const node = cloned.getNode() as HTMLLIElement;

        // hide numbering for split list items
        node.style.listStyleType = 'none';

        // decrement the rendered count of items in the previous list,
        // as this item is duplicated across multiple lists (previous and current)
        const sourceParent =
            cloned.clonedData.clonedFrom?.getNode().parentElement;
        const originalParent = cloned.getOriginalNode().parentElement;

        if (
            !sourceParent ||
            !originalParent ||
            !this._isOrderedList(sourceParent) ||
            !this._isOrderedList(originalParent)
        ) {
            return;
        }

        const currentCount = this._readRenderedItemCount(
            originalParent,
            (list) => list === sourceParent
        );
        this._setListItemCount(originalParent, sourceParent, currentCount - 1);
    };

    afterVisitNode = (
        _id: string,
        _result: SplitResult,
        _domState: DomState,
        pageManager: PageManager
    ) => {
        const currentElement = pageManager.getPageState().currentElement;
        const node = currentElement.getNode();

        if (!this._isOrderedList(node)) return;

        const originalList =
            currentElement.getOriginalNode() as HTMLOListElement;

        // shift the start index for the list based on how many items have been rendered in previous lists
        const renderedItemCount = this._readRenderedItemCount(
            originalList,
            (list) => list !== node
        );
        node.start = originalList.start + renderedItemCount;

        // keep track of how many items have been rendered in the current list
        const itemCount = this._getListItemCount(node);
        this._setListItemCount(originalList, node, itemCount);
    };

    beforePagination = () => {
        this._originalItemCount.clear();
    };

    private _isListItem(element: SafeElement): element is HTMLLIElement {
        return element.tagName === 'LI';
    }

    private _isOrderedList(element: SafeElement): element is HTMLOListElement {
        return element.tagName === 'OL';
    }

    private _setListItemCount(
        originalList: HTMLOListElement,
        list: HTMLOListElement,
        count: number
    ): void {
        const cloneCatalog =
            this._originalItemCount.get(originalList) ??
            new Map<HTMLOListElement, number>();

        cloneCatalog.set(list, count);
        this._originalItemCount.set(originalList, cloneCatalog);
    }

    private _readRenderedItemCount(
        originalList: HTMLOListElement,
        filter: (list: HTMLOListElement) => boolean
    ): number {
        const cloneCatalog = this._originalItemCount.get(originalList);
        if (!cloneCatalog) return 0;

        return [...cloneCatalog.entries()]
            .filter((i) => filter(i[0]))
            .reduce((a, b) => a + b[1], 0);
    }

    private _getListItemCount(list: HTMLOListElement): number {
        return [...list.children].filter((child) => this._isListItem(child))
            .length;
    }
}
