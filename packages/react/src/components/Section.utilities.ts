import { getVisibleHeight, type PaginationPlugin } from '@paprize/core/src';
import type { PageDimension, PageOrientation } from './pageTypes';
import { getVisibleSize } from './Page.utilities';

export function adjustDimension(
    dimension: PageDimension,
    orientation: PageOrientation
): PageDimension {
    if (orientation === 'landscape') {
        return { height: dimension.width, width: dimension.height };
    }

    return dimension;
}

export function buildSectionStyle(
    sectionId: string,
    dimension: PageDimension
): HTMLStyleElement {
    const style = document.createElement('style');
    style.appendChild(
        document.createTextNode(`
    @page section-${sectionId} {
      margin: none; 
      size:${dimension.width} ${dimension.height}; 
      width:${dimension.width};
      height:${dimension.height};
    }
    `)
    );

    return style;
}

export function calculatePageDimensions(
    current: HTMLDivElement,
    sectionHeader: HTMLDivElement,
    sectionFooter: HTMLDivElement
): { height: number; width: number; heightWithoutSection: number } {
    const { height, width } = getVisibleSize(current);
    const sectionHeaderHeight = getVisibleHeight(sectionHeader);
    const sectionFooterHeight = getVisibleHeight(sectionFooter);
    const heightWithoutSection =
        height + sectionHeaderHeight + sectionFooterHeight;

    return { height, width, heightWithoutSection };
}

export function createSectionPageHeightPlugin(
    height: number,
    heightWithoutSection: number
): PaginationPlugin {
    return {
        name: 'sectionPageHeight',
        onNewPage: (pageState) => {
            if (pageState.pageIndex === 0) {
                pageState.pageHeight = height;
            } else {
                pageState.pageHeight = heightWithoutSection;
            }
        },
    };
}
