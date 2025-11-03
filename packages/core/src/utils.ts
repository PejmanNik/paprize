import type { PageSize, PageOrientation } from './report/pageTypes';

export function buildPageId(sectionId: string, pageIndex: number): string {
    return `${sectionId}-${pageIndex + 1}`;
}

export function adjustPageSize(
    size: PageSize,
    orientation?: PageOrientation
): PageSize {
    if (orientation === 'landscape') {
        return { height: size.width, width: size.height };
    }

    return size;
}
