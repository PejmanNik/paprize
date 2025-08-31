import type { PaginationPlugin } from '../paginate/PaginationPlugin';
import { SplitResult } from '../paginate/SplitResult';

export const pageBreakAttributeName = 'data-pz-page-break';
export const pageBreakPluginName = 'pageBreak';

export const pageBreakPlugin: PaginationPlugin = {
    name: pageBreakPluginName,
    onVisitElement: (currentNode, pageManager, context) => {
        if (
            currentNode.getNode().getAttribute(pageBreakAttributeName) ===
            'true'
        ) {
            pageManager.markPageAsFull();

            // ignore the page break node itself
            context.result = SplitResult.FullNodePlaced;
        }
    },
};
