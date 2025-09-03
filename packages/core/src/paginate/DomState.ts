import {
    markCurrentNode,
    unmarkCurrentNode,
} from '../debugUtilities/pageNodeMarker';
import { type PageNode, createPageNode } from './PageNodes';
import {
    getConfigFromAttributes,
    type PaginationConfig,
} from './PaginationConfig';
import type { Transaction } from './Transaction';
import logger from '../logger';

const logPrefix = '\x1b[106mDOM\x1b[0m';

export class DomState {
    private readonly _transaction: Transaction;
    private readonly _treeWalker: TreeWalker;
    private readonly _config: PaginationConfig;

    private _completed: boolean = false;
    private _currentNode: PageNode | null = null;
    private _previousNode: PageNode | null = null;

    constructor(
        root: Element,
        transaction: Transaction,
        config: PaginationConfig
    ) {
        this._transaction = transaction;
        this._config = config;
        this._treeWalker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT
        );
    }

    public get completed(): boolean {
        return this._completed;
    }
    public get currentNode(): PageNode | null {
        return this._currentNode;
    }
    public get previousNode(): PageNode | null {
        return this._previousNode;
    }

    public nextNode() {
        const result = this._treeWalker.nextNode();
        if (!result) {
            this._completed = true;
        }

        logger.debug(logPrefix, 'moving to next node');

        this.setState();
    }

    public nextSiblingOrParentSibling(): { parentsTraversed: number } {
        let parentsTraversed = 0;

        if (this._treeWalker.nextSibling()) {
            logger.debug(logPrefix, 'moving to next sibling node');

            this.setState();
            return { parentsTraversed };
        }

        // no sibling found, traverse up the tree to find the next available node
        while (this._treeWalker.parentNode()) {
            parentsTraversed++;

            if (this._treeWalker.nextSibling()) {
                logger.debug(
                    logPrefix,
                    'moving to parent sibling node, traversed:',
                    parentsTraversed
                );

                this.setState();
                return { parentsTraversed };
            }
        }

        this._completed = true;
        return { parentsTraversed };
    }

    public firstChildOrNextNode(): { parentsTraversed: number } {
        if (this._treeWalker.firstChild()) {
            logger.debug(logPrefix, 'moving to first child node');
            this.setState();
            return { parentsTraversed: 1 };
        }

        this.nextNode();
        return { parentsTraversed: 0 };
    }

    private setState() {
        this._previousNode = this._currentNode;
        this._currentNode = createPageNode(
            this._treeWalker.currentNode,
            this._transaction,
            getConfigFromAttributes(this._treeWalker.currentNode, this._config)
        );

        DEV: markCurrentNode(this.currentNode);
        DEV: unmarkCurrentNode(this.previousNode);

        logger.debug(logPrefix, 'moved to node', {
            currentNode: this.currentNode,
            previousNode: this.previousNode,
        });
    }
}
