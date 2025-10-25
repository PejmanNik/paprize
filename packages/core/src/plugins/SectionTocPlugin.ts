import type { DomState } from '../paginate/DomState';
import type { PageManager } from '../paginate/PageManager';
import type { PageElement, SafeElement } from '../paginate/PageNodes';
import type { PaginationPlugin } from '../paginate/PaginationPlugin';

export const sectionTocName = 'sectionToc';

export type SectionTocState = {
    sectionId: string;
    pageIndex: number;
    title: string;
    level: number;
};

export class SectionTocPlugin implements PaginationPlugin {
    public readonly name = sectionTocName;
    public readonly order = 1;

    private _state: Map<string, SectionTocState[]> = new Map();

    public getContentList = (): SectionTocState[] => {
        return Array.from(this._state.values()).flat();
    };

    public onVisitElement = (
        id: string,
        domState: DomState & { currentNode: PageElement },
        pageManager: PageManager
    ) => {
        {
            const node = domState.currentNode.getNode();
            const headingLevel = this.getHeadingLevel(node);

            if (!headingLevel || !node.textContent) return;

            const pageIndex = pageManager.getPageState().pageIndex;

            // cleanup state for first page of section
            if (pageIndex === 0) {
                this._state.set(id, []);
            }

            this._state.get(id)?.push({
                sectionId: id,
                pageIndex: pageIndex,
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
