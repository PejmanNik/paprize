import {
    createPageNode,
    PageNodeType,
    type PageElement,
    type PageNode,
    type PageText,
} from './PageNodes';
import { Transaction } from './Transaction';
import { isDebugMode } from '../debugUtilities/debugMode';
import { pageClassName } from '../constants';
import type { PageSize } from './PageSize';
import { unmarkCurrentNode } from '../debugUtilities/pageNodeMarker';
import logger from '../logger';
import { type PaginationConfig } from './PaginationConfig';
import { callPluginHook } from './PaginationPlugin';

const logPrefix = '\x1b[102mPAGE\x1b[0m';

export class PageState {
    public currentPage: PageElement;
    public activeElement: PageNode | null;
    public currentElement: PageElement;
    public parentStack: PageElement[];
    public pageIsFull: boolean;
    public pageIndex: number;
    public pageHeight: number;

    constructor(
        currentPage: PageElement,
        activeElement: PageNode | null,
        currentElement: PageElement,
        parentStack: PageElement[],
        pageIsFull: boolean,
        pageIndex: number,
        pageHeight: number
    ) {
        this.currentPage = currentPage;
        this.activeElement = activeElement;
        this.currentElement = currentElement;
        this.parentStack = parentStack;
        this.pageIsFull = pageIsFull;
        this.pageIndex = pageIndex;
        this.pageHeight = pageHeight;
    }

    public static create(
        currentPage: PageElement,
        parentStack: PageElement[],
        pageIndex: number,
        pageHeight: number
    ) {
        return new PageState(
            currentPage,
            null,
            currentPage,
            parentStack,
            false,
            pageIndex,
            pageHeight
        );
    }

    public clone = (): PageState => {
        return new PageState(
            this.currentPage,
            this.activeElement,
            this.currentElement,
            [...this.parentStack],
            this.pageIsFull,
            this.pageIndex,
            this.pageHeight
        );
    };
}

export class PageManager {
    private _pageState: PageState;

    private readonly _transaction: Transaction;
    private readonly _tempContainer: Element;
    private readonly _config: PaginationConfig;

    public constructor(
        tempContainer: Element,
        pageSize: PageSize,
        transaction: Transaction,
        config: PaginationConfig
    ) {
        this._tempContainer = tempContainer;
        this._config = config;
        this._transaction = transaction;

        const pageHtmlElement = PageManager.createPageHtmlElement(
            pageSize.width
        );

        const page = this.createNewPage(pageHtmlElement);
        this._pageState = PageState.create(page, [], 0, pageSize.height);
        callPluginHook(this._config.plugins, 'onNewPage', config.id, this);
    }

    public nextPage(): void {
        const page = this.createNewPage(
            this._pageState.currentPage.getNode().cloneNode(false) as Element
        );

        const newPageState = PageState.create(
            page,
            [],
            this._pageState.pageIndex + 1,
            this._pageState.pageHeight
        );

        // add uncompleted parents elements to the new page
        this.cloneParentStackToNewPage(newPageState);
        this.cleanupEmptyParent();

        this._pageState = newPageState;
        callPluginHook(
            this._config.plugins,
            'onNewPage',
            this._config.id,
            this
        );
    }

    private cloneParentStackToNewPage(newPageState: PageState): void {
        for (const parent of this._pageState.parentStack) {
            const clonedParent = parent.clone(false);
            newPageState.currentElement.appendChild(clonedParent);
            newPageState.currentElement = clonedParent;
            newPageState.parentStack.push(clonedParent);
        }
    }

    private cleanupEmptyParent(): void {
        const parentStack = [...this._pageState.parentStack];

        const cleanup = () => {
            // iterate backwards to check the element in order
            for (let i = parentStack.length - 1; i >= 0; i--) {
                const parent = parentStack[i];
                if (parent.isEmpty()) {
                    parent.remove();
                }
            }
        };

        this._transaction.addCommitCallback(cleanup);
    }

    public enterElement(): void {
        if (
            !this._pageState.activeElement ||
            this._pageState.activeElement.type !== PageNodeType.Element
        ) {
            throw new Error('Invalid state: activeElement is not an Element');
        }

        logger.debug(
            logPrefix,
            'entering an element',
            this._pageState.activeElement
        );
        this._pageState.currentElement = this._pageState.activeElement;
        this._pageState.parentStack.push(this._pageState.activeElement);
    }

    public leaveElement(): void {
        this._pageState.activeElement = null;

        // remove last parent as we are leaving it
        const popped = this._pageState.parentStack.pop();
        logger.debug(logPrefix, 'leaving a parent element', popped);

        // find the original parent
        const parent = this._pageState.parentStack.at(-1);
        this._pageState.currentElement = parent ?? this._pageState.currentPage;
    }

    private static createPageHtmlElement(pageWidth: number): Element {
        const page = document.createElement('div');
        page.style.display = 'flex'; // to avoid margin collapsing
        page.style.flexDirection = 'column';
        page.style.width = `${pageWidth}px`;
        page.style.maxWidth = `${pageWidth}px`;

        DEV: if (isDebugMode()) {
            page.classList.add(pageClassName);
        }

        return page;
    }

    private createNewPage(pageHtmlElement: Element): PageElement {
        this._tempContainer.appendChild(pageHtmlElement);

        if (this._transaction.isActive) {
            this._transaction.addRollbackCallback(() => {
                this._tempContainer.removeChild(pageHtmlElement);
            });
        }

        return createPageNode(pageHtmlElement, this._transaction, this._config);
    }

    public startTransaction(): { rollback: () => void; commit: () => void } {
        this._transaction.start();

        const state = this._pageState.clone();
        this._transaction.addRollbackCallback(() => {
            this._pageState = state;
        });

        return this._transaction;
    }

    public hasEmptySpace(elementHeight?: number): boolean {
        return (
            !this._pageState.pageIsFull &&
            this._pageState.currentPage.getHeight() + (elementHeight || 1) <=
                this._pageState.pageHeight
        );
    }

    public isOverFlow(): boolean {
        return (
            this._pageState.currentPage.getHeight() > this._pageState.pageHeight
        );
    }

    public markPageAsFull(): void {
        this._pageState.pageIsFull = true;
    }

    public appendChild(node: PageElement, withChildren: boolean): PageElement {
        const clonedNode = node.clone(withChildren);

        DEV: unmarkCurrentNode(clonedNode);

        this._pageState.currentElement.appendChild(clonedNode);
        this._pageState.activeElement = clonedNode;

        return clonedNode;
    }

    public addTextNode(text: string): PageText {
        if (this._pageState.activeElement?.type === PageNodeType.Text) {
            return this._pageState.activeElement;
        }

        const textNode = document.createTextNode(text);
        const newTextNode = createPageNode(
            textNode,
            this._transaction,
            this._config
        );

        this._pageState.currentElement.appendChild(newTextNode);
        this._pageState.activeElement = newTextNode;

        return newTextNode;
    }

    public getPageState(): PageState {
        return this._pageState;
    }
}
