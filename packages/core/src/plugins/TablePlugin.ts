import { PageElement } from '../paginate/PageNodes';
import type { PaginationPlugin } from '../paginate/PaginationPlugin';

export interface TablePluginOptions {
    /**
     * If true, the table header (thead) will be cloned on each page.
     */
    cloneHeader?: boolean;
    /**
     * If true, the table footer (tfoot) will be cloned on each page.
     */
    cloneFooter?: boolean;
}

export class TablePlugin implements PaginationPlugin {
    private readonly _options: TablePluginOptions = {};

    public name = 'table';
    public order = 1;

    constructor(options: TablePluginOptions = {}) {
        this._options = options;
    }

    onClone = (_id: string, source: Element, cloned: PageElement) => {
        if (source.tagName === 'TR') {
            cloned.config.keepOnSamePage = true;
            return;
        }

        if (
            source.tagName !== 'TABLE' ||
            !cloned.clonedFrom ||
            cloned.cloneCount === 1
        ) {
            return;
        }

        const originalNode = cloned.getOriginalNode() as HTMLTableElement;
        const head = originalNode.tHead;
        if (head && this._options.cloneHeader === true) {
            const clonedHead = new PageElement(
                head.cloneNode(true) as HTMLElement,
                cloned.transaction,
                cloned.config
            );
            cloned.appendChild(clonedHead);
        }

        const foot = originalNode.tFoot;
        if (foot && this._options.cloneFooter === true) {
            const clonedFoot = new PageElement(
                foot.cloneNode(true) as HTMLElement,
                cloned.transaction,
                cloned.config
            );
            cloned.appendChild(clonedFoot);
        }
    };
}
