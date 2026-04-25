import type { PageNode } from './paginate/PageNodes';
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

export function pageNodeToString(node: PageNode | null): string {
    if (!node) return 'undefined';

    const el = node.getNode();
    if (!(el instanceof Element)) return String(el).slice(0, 100);

    const id = el.id ? `#${el.id}` : '';
    const classes = el.classList.length
        ? `.${Array.from(el.classList).join('.')}`
        : '';

    return `<${el.tagName.toLowerCase()}${id}${classes}>`;
}
