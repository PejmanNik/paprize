import { getVisibleHeight, type PaginationPlugin } from '@paprize/core/src';
import { getVisibleSize } from './Page.utilities';

export function calculatePageDimensions(
    current: HTMLDivElement,
    sectionHeader: HTMLDivElement | null,
    sectionFooter: HTMLDivElement | null
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
