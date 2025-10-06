export function buildPageId(sectionId: string, pageIndex: number): string {
    return `${sectionId}-${pageIndex + 1}`;
}