import { type PageManager } from './PageManager';
import { SplitResult } from './SplitResult';
import type { PageElement } from './PageNodes';

/**
 * Tries to split the given element across pages by first attempting to place it
 * (with its entire subtree) on the current page, then (if needed) on the next page.
 * Falls back to partial (without children) placement when allowed.
 */
export function paginateElementAcrossPages(
    currentNode: PageElement,
    pageManager: PageManager
): SplitResult {
    // try on current page
    const result = tryPlaceElement(currentNode, pageManager);
    if (result !== SplitResult.None) {
        return result;
    }

    // try on next page (transactional)
    const { rollback, commit } = pageManager.startTransaction();
    pageManager.nextPage();

    const nextPageResult = tryPlaceElement(currentNode, pageManager);
    if (nextPageResult !== SplitResult.None) {
        commit();
        return nextPageResult;
    }

    rollback();

    if (currentNode.config.keepOnSamePage === 'prefer') {
        return tryPlaceElementWithoutChildren(currentNode, pageManager);
    }

    return SplitResult.None;
}

/**
 * Attempts to place the node (first with children, then without if allowed).
 * Returns the achieved SplitResult or None if not possible.
 */
function tryPlaceElement(
    currentNode: PageElement,
    pageManager: PageManager
): SplitResult {
    // fast path: try full subtree if height suggests it could fit
    if (pageManager.hasEmptySpace(currentNode.getHeight())) {
        // copy the next node and sub tree of it to the current page
        const clonedNode = pageManager.appendChild(currentNode, true);
        if (pageManager.isOverFlow()) {
            // If overflow after optimistic append, we removed it and continue to partial logic
            clonedNode.remove();
        } else {
            return SplitResult.FullNodePlaced;
        }
    }

    // allowed to split the element
    if (currentNode.config.keepOnSamePage === false) {
        return tryPlaceElementWithoutChildren(currentNode, pageManager);
    }

    return SplitResult.None;
}

function tryPlaceElementWithoutChildren(
    currentNode: PageElement,
    pageManager: PageManager
): SplitResult {
    if (currentNode.getChildrenCount() === 0) {
        // cannot split the element
        return SplitResult.None;
    }

    // Try placing only the element without children (children will render later)
    const clonedNode = pageManager.appendChild(currentNode, false);
    if (pageManager.isOverFlow()) {
        clonedNode.remove();
        return SplitResult.None;
    }

    return SplitResult.SplitChildren;
}
