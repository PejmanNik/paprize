import { DomState } from './DomState';
import { PageManager } from './PageManager';
import type { PageSize } from './PageSize';
import { PageNodeType } from './PageNodes';
import { paginateElementAcrossPages } from './paginateElement';
import { paginateTextByWord } from './paginateText';
import { SplitResult } from './SplitResult';
import { Transaction } from './Transaction';
import logger from 'loglevel';
import { defaultConfig, type PaginationConfig } from './PaginationConfig';
import { markIgnoredNode } from '../utilities/pageNodeMarker';
import { tempBookClassName } from '../constants';
import { callPluginHook, type VisitContext } from './PaginationPlugin';

const logPrefix = '\x1b[103mPAGINATOR\x1b[0m';

export interface PaginateResult {
    pages: ChildNode[];
    dispose: () => void;
}

export class Paginator {
    private readonly _domState: DomState;
    private readonly _pageManager: PageManager;
    private readonly _transaction: Transaction;
    private readonly _tempBook: Element;
    private readonly _config: PaginationConfig;

    constructor(
        root: Element,
        pageSize: PageSize,
        config?: Partial<PaginationConfig>
    ) {
        this._config = { ...defaultConfig, ...config };
        this._tempBook = document.createElement('div');
        this._tempBook.classList.add(tempBookClassName);
        document.body.appendChild(this._tempBook);

        this._transaction = new Transaction();
        this._domState = new DomState(root, this._transaction, this._config);
        this._pageManager = new PageManager(
            this._tempBook,
            pageSize,
            this._transaction,
            this._config
        );
    }

    public paginate(): PaginateResult {
        this.processAllNodes();

        return {
            pages: Array.from(this._tempBook.childNodes),
            dispose: () => {
                this._tempBook.remove();
            },
        };
    }

    private processAllNodes(): void {
        this._domState.nextNode();

        do {
            logger.info(
                logPrefix,
                'paginating node',
                this._domState.currentNode
            );
            const result = this.processCurrentNode();
            switch (result) {
                case SplitResult.None:
                    this.handleNodeSkipped();
                    break;

                case SplitResult.FullNodePlaced:
                    this.handleFullNodePlaced();
                    break;

                case SplitResult.SplitChildren:
                    this.handleChildrenSplit();
                    break;
            }
        } while (this._domState.completed === false);

        logger.info(logPrefix, 'pagination completed');
    }

    private handleNodeSkipped(): void {
        logger.info(logPrefix, "node skipped - couldn't paginate");

        markIgnoredNode(this._domState.currentNode);
        this._domState.nextNode();
    }

    private handleFullNodePlaced(): void {
        logger.info(logPrefix, 'node fully paginated');

        const { parentsTraversed } =
            this._domState.nextSiblingOrParentSibling();
        for (let i = 0; i < parentsTraversed; i++) {
            this._pageManager.leaveElement();
        }
    }

    private handleChildrenSplit(): void {
        logger.info(logPrefix, 'node partially paginated - splitting children');

        if (
            this._domState.firstChildOrNextNode().parentsTraversed === 1 &&
            this._domState.previousNode?.type === PageNodeType.Element
        ) {
            this._pageManager.enterElement();
        }
    }

    private processCurrentNode(): SplitResult {
        if (!this._domState.currentNode) {
            return SplitResult.None;
        }

        if (this._domState.currentNode.type === PageNodeType.Element) {
            // call plugins ...
            const ctx: VisitContext = {};
            callPluginHook(
                this._config.plugins,
                'onVisitElement',
                this._domState.currentNode,
                this._pageManager,
                ctx
            );
            if (ctx.result !== undefined) {
                return ctx.result;
            }
            // ... plugins called

            return paginateElementAcrossPages(
                this._domState.currentNode,
                this._pageManager
            );
        } else {
            // call plugins ...
            const ctx: VisitContext = {};
            callPluginHook(
                this._config.plugins,
                'onVisitText',
                this._domState.currentNode,
                this._pageManager,
                ctx
            );
            if (ctx.result !== undefined) {
                return ctx.result;
            }
            // ... plugins called

            return paginateTextByWord(
                this._domState.currentNode,
                this._pageManager
            );
        }
    }
}
