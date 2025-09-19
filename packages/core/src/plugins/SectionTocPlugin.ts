import type { DomState } from '../paginate/DomState';
import type { PageManager } from '../paginate/PageManager';
import type { PageElement, SafeElement } from '../paginate/PageNodes';
import type { PaginationPlugin } from '../paginate/PaginationPlugin';

export const sectionTocName = 'sectionToc';

export type SectionTocState = {
    sectionId: string;
    pageNumber: number;
    title: string;
    level: number;
};

export class SectionTocPlugin implements PaginationPlugin {
    public readonly state: SectionTocState[] = [];
    public readonly name = sectionTocName;

    public onVisitElement = (
        id: string,
        domState: DomState & { currentNode: PageElement },
        pageManager: PageManager
    ) => {
        {
            const node = domState.currentNode.getNode();
            const headingLevel = this.getHeadingLevel(node);

            if (!headingLevel || !node.textContent) return;

            this.state.push({
                sectionId: id,
                pageNumber: pageManager.getPageState().pageIndex + 1,
                title: node.textContent,
                level: headingLevel,
            });
        }
    };

    getHeadingLevel(node: SafeElement): number | null {
        const tagName = node.tagName;
        return /^H[1-6]$/.test(tagName)
            ? parseInt(tagName.charAt(1), 10)
            : null;
    }
}
