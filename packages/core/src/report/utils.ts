import { getVisibleHeight } from '../paginate/domUtilities';
import type { PaginationPlugin } from '../paginate/PaginationPlugin';
import type { PageMargin } from './pageTypes';

export function getVisibleSize(element: Element) {
    const rect = element.getBoundingClientRect();
    const computedStyle = getComputedStyle(element);

    const marginLeft = parseFloat(computedStyle.marginLeft) || 0;
    const marginRight = parseFloat(computedStyle.marginRight) || 0;

    return {
        height: getVisibleHeight(element),
        width: rect.width + marginLeft + marginRight,
    };
}

export function calculatePageDimensions(
    current: HTMLElement,
    sectionHeader: HTMLElement | null,
    sectionFooter: HTMLElement | null
): {
    height: number;
    width: number;
    sectionHeaderHeight: number;
    sectionFooterHeight: number;
} {
    const { height, width } = getVisibleSize(current);
    const sectionHeaderHeight = sectionHeader
        ? getVisibleHeight(sectionHeader)
        : 0;
    const sectionFooterHeight = sectionFooter
        ? getVisibleHeight(sectionFooter)
        : 0;

    return { height, width, sectionHeaderHeight, sectionFooterHeight };
}

export function createSectionPageHeightPlugin(
    height: number,
    sectionHeaderHeight: number,
    sectionFooterHeight: number
): PaginationPlugin {
    return {
        name: 'sectionPageHeight',
        order: 1,
        afterVisitNode: (_, domState, pageManager) => {
            const lastPage = domState.completed;
            if (!lastPage || sectionFooterHeight <= 0) return;

            // if there is no empty space for the section footer, create a new page for it
            if (!pageManager.hasEmptySpace(sectionFooterHeight)) {
                pageManager.nextPage();
            }
        },
        onNewPage: (_, pageManager) => {
            const pageState = pageManager.getPageState();
            if (pageState.pageIndex === 0) {
                pageState.pageHeight = height + sectionFooterHeight; // reserve sectionHeaderHeight
            } else {
                pageState.pageHeight =
                    height + sectionHeaderHeight + sectionFooterHeight;
            }
        },
    };
}

export function shorthand(margin?: PageMargin) {
    return margin
        ? `${margin.top} ${margin.right} ${margin.bottom} ${margin.left}`
        : '0';
}

export async function isAllResolved(promises: Promise<void>[]) {
    const all = Promise.all(promises).then(() => true);

    // let all microtask queue flush by queuing a macrotask
    await new Promise((resolve) => setTimeout(resolve, 0));

    const raceResult = await Promise.race([all, Promise.resolve(false)]);

    return raceResult;
}
