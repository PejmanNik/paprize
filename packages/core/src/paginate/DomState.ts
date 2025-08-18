import {
    markCurrentNode,
    unmarkCurrentNode,
} from '../utilities/pageNodeMarker';
import { type PageNode, createPageNode } from './PageNodes';
import {
    getConfigFromAttributes,
    type PaginationConfig,
} from './PaginationConfig';
import type { Transaction } from './Transaction';
import logger from 'loglevel';

const logPrefix = '\x1b[106mDOM\x1b[0m';

export class DomState {
    private _transaction: Transaction;
    private _treeWalker: TreeWalker;
    private _config: PaginationConfig;

    public completed: boolean = false;
    public currentNode: PageNode | null = null;
    public previousNode: PageNode | null = null;

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

    public nextNode() {
        const result = this._treeWalker.nextNode();
        if (!result) {
            this.completed = true;
        }

        logger.info(logPrefix, 'moving to next node');

        this.setState();
    }

    public nextSiblingOrParentSibling(): { parentsTraversed: number } {
        let parentsTraversed = 0;

        if (this._treeWalker.nextSibling()) {
            logger.info(logPrefix, 'moving to next sibling node');

            this.setState();
            return { parentsTraversed };
        }

        // no sibling found, traverse up the tree to find the next available node
        while (this._treeWalker.parentNode()) {
            parentsTraversed++;

            if (this._treeWalker.nextSibling()) {
                logger.info(
                    logPrefix,
                    'moving to parent sibling node, traversed:',
                    parentsTraversed
                );

                this.setState();
                return { parentsTraversed };
            }
        }

        this.completed = true;
        return { parentsTraversed };
    }

    public firstChildOrNextNode(): { parentsTraversed: number } {
        if (this._treeWalker.firstChild()) {
            logger.info(logPrefix, 'moving to first child node');
            this.setState();
            return { parentsTraversed: 1 };
        }

        this.nextNode();
        return { parentsTraversed: 0 };
    }

    private setState() {
        this.previousNode = this.currentNode;
        this.currentNode = createPageNode(
            this._treeWalker.currentNode,
            this._transaction,
            getConfigFromAttributes(this._treeWalker.currentNode, this._config)
        );

        markCurrentNode(this.currentNode);
        unmarkCurrentNode(this.previousNode);

        logger.info(logPrefix, 'moved to node', {
            currentNode: this.currentNode,
            previousNode: this.previousNode,
        });
    }
}
