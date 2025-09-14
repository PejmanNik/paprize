import type { PageDimension, PageOrientation } from './pageTypes';

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
): string {
    return `@page section-${sectionId} {
      margin: none; 
      size:${dimension.width} ${dimension.height}; 
      width:${dimension.width};
      height:${dimension.height};
    }`;
}
