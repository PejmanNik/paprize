import type { DomState } from '../paginate/DomState';
import type { PageManager } from '../paginate/PageManager';
import type { PageElement } from '../paginate/PageNodes';
import type {
    PaginationPlugin,
    VisitContext,
} from '../paginate/PaginationPlugin';
import { SplitResult } from '../paginate/SplitResult';

export const pageBreakAttributeName = 'data-pz-page-break';

export class PageBreakPlugin implements PaginationPlugin {
    public name = 'pageBreak';
    public order = 1;

    onVisitElement = (
        _id: string,
        domState: DomState & { currentNode: PageElement },
        pageManager: PageManager,
        context: VisitContext
    ) => {
        if (
            domState.currentNode
                .getNode()
                .getAttribute(pageBreakAttributeName) === 'true'
        ) {
            pageManager.markPageAsFull();

            // ignore the page break node itself
            context.result = SplitResult.FullNodePlaced;
        }
    };
}
