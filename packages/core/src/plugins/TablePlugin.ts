import type { PageManager } from '../paginate/PageManager';
import {
    createPageNode,
    PageElement,
    type SafeElement,
} from '../paginate/PageNodes';
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
    /**
     * When true, tables containing only a header (no body rows) will not be removed.
     */
    includeHeaderOnlyTables?: boolean;
}

export class TablePlugin implements PaginationPlugin {
    private readonly _options: TablePluginOptions = {};

    public name = 'table';
    public order = 1;

    constructor(options: TablePluginOptions = {}) {
        this._options = options;
    }

    onNewPage = (_id: string, pageManager: PageManager) => {
        if (this._options.includeHeaderOnlyTables) {
            return;
        }

        const pageState = pageManager.getPageState();
        const tableElement = pageState.parentStack.find((node) =>
            this._isTable(node.getNode())
        );
        if (!tableElement || !tableElement.clonedFrom) {
            return;
        }

        // need to check previous page elements, so have to use clonedFrom
        const openTable = tableElement.clonedFrom;
        const openTableNode = openTable.getNode() as HTMLTableElement;

        const header = openTableNode.tHead;
        const hasHeader = header !== null;
        if (!hasHeader) {
            return;
        }

        const body = openTableNode.tBodies;
        if (!this._isTableBodyEmpty(body)) {
            return;
        }

        openTable.remove();

        const newTable = tableElement.getNode() as HTMLTableElement;
        if (newTable.tHead === null) {
            const headerNode = createPageNode(
                header.cloneNode(true),
                tableElement.transaction,
                tableElement.config
            );
            tableElement.appendChild(headerNode);
        }
    };

    onClone = (_id: string, source: Element, cloned: PageElement) => {
        if (source.tagName === 'TR') {
            cloned.config.keepOnSamePage = true;
            return;
        }

        if (
            !this._isTable(source) ||
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

    private _isTable(
        element: Element | SafeElement
    ): element is HTMLTableElement {
        return element.tagName === 'TABLE';
    }

    private _isTableBodyEmpty(
        body: HTMLCollectionOf<HTMLTableSectionElement>
    ): boolean {
        if (body.length === 0) return true;

        const tbody = body[0];
        if (tbody.rows.length !== 1) return false;

        const row = tbody.rows[0];
        if (row.cells.length !== 1) return false;

        const cell = row.cells[0];
        return cell.textContent.trim() === '';
    }
}
