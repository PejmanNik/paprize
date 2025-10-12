import type { PageDimension, PageOrientation } from "./report/pageTypes";

export function buildPageId(sectionId: string, pageIndex: number): string {
    return `${sectionId}-${pageIndex + 1}`;
}

export function adjustDimension(
    dimension: PageDimension,
    orientation: PageOrientation
): PageDimension {
    if (orientation === 'landscape') {
        return { height: dimension.width, width: dimension.height };
    }

    return dimension;
}