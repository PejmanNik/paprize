import { DomState } from './DomState';
import { PageManager } from './PageManager';
import type { RealizedPageSize } from './RealizedPageSize';
import { PageElement, PageNodeType, PageText } from './PageNodes';
import { paginateElementAcrossPages } from './paginateElement';
import { paginateTextByWord } from './paginateText';
import { SplitResult } from './SplitResult';
import { Transaction } from './Transaction';
import logger from 'loglevel';
import {
    defaultPaginationOptions,
    type PaginationOptions,
} from './PaginationOptions';
import { markIgnoredNode } from '../debugUtilities/pageNodeMarker';
import { callPluginHook, type VisitContext } from './PaginationPlugin';
import { attributePrefix, tempContainerClassName } from '../constants';
import { isDebugMode } from '../debugUtilities/debugMode';
import { isElement, moveOffscreen } from './domUtilities';

const logPrefix = '\x1b[103mPAGINATOR\x1b[0m';

export type PaginateResult = string[];

export class Paginator {
    private readonly _domState: DomState;
    private readonly _pageManager: PageManager;
    private readonly _transaction: Transaction;
    private readonly _tempContainer: Element;
    private readonly _config: PaginationOptions;

    private constructor(
        root: Element,
        pageSize: RealizedPageSize,
        config?: Partial<PaginationOptions>
    ) {
        this._config = { ...defaultPaginationOptions, ...config };
        this._tempContainer = Paginator.createTempContainer(this._config.id);
        this._transaction = new Transaction();
        this._domState = new DomState(root, this._transaction, this._config);
        this._pageManager = new PageManager(
            this._tempContainer,
            pageSize,
            this._transaction,
            this._config
        );
    }

    private static createTempContainer(id: string): Element {
        const tempContainer = document.createElement('div');
        tempContainer.style.display = 'flex'; // to avoid margin collapsing between pages
        tempContainer.style.flexDirection = 'column';
        tempContainer.style.gap = '20px';
        tempContainer.setAttribute(`${attributePrefix}-section-id`, id);

        tempContainer.classList.add(tempContainerClassName);
        DEV: if (!isDebugMode()) {
            moveOffscreen(tempContainer);
        }
        document.body.appendChild(tempContainer);
        return tempContainer;
    }

    public static paginate(
        root: Element,
        pageSize: RealizedPageSize,
        config?: Partial<PaginationOptions>
    ): PaginateResult {
        const paginator = new Paginator(root, pageSize, config);
        paginator.processAllNodes();

        const result = Array.from(paginator._tempContainer.childNodes)
            .filter((x) => isElement(x))
            .map((x) => x.innerHTML);

        DEV: if (!isDebugMode()) {
            paginator._tempContainer.remove();
        }

        return result;
    }

    private processAllNodes(): void {
        this._domState.goToNextNode();

        do {
            logger.debug(
                logPrefix,
                'paginating node',
                this._domState.currentNode
            );
            const result = this.processCurrentNode();

            callPluginHook(
                this._config.plugins,
                'afterVisitNode',
                this._config.id,
                result,
                this._domState,
                this._pageManager
            );

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

        logger.debug(logPrefix, 'pagination completed');
    }

    private handleNodeSkipped(): void {
        logger.debug(logPrefix, "node skipped - couldn't paginate");

        DEV: markIgnoredNode(this._domState.currentNode);
        this._domState.goToNextNode();
    }

    private handleFullNodePlaced(): void {
        logger.debug(logPrefix, 'node fully paginated');

        const { parentsTraversed } =
            this._domState.goToNextSiblingOrParentSibling();
        for (let i = 0; i < parentsTraversed; i++) {
            this._pageManager.leaveElement();
        }
    }

    private handleChildrenSplit(): void {
        logger.debug(
            logPrefix,
            'node partially paginated - splitting children'
        );

        if (
            this._domState.goToFirstChildOrNextNode().parentsTraversed === 1 &&
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
                this._config.id,
                this._domState as DomState & { currentNode: PageElement },
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
                this._config.id,
                this._domState as DomState & { currentNode: PageText },
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
