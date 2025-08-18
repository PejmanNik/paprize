import {
    createPageNode,
    PageNodeType,
    type PageElement,
    type PageNode,
    type PageText,
} from './PageNodes';
import { Transaction } from './Transaction';
import { isInHighlightMode } from '../utilities/debugMode';
import { pageClassName } from '../constants';
import type { PageSize } from './PageSize';
import { unmarkCurrentNode } from '../utilities/pageNodeMarker';
import logger from 'loglevel';
import type { PaginationConfig } from './PaginationConfig';

const logPrefix = '\x1b[102mPAGE: \x1b[0m';

class PageState {
    public currentPage: PageElement;
    public activeElement: PageNode | null;
    public currentElement: PageElement;
    public parentStack: PageElement[];
    public pageIsFull: boolean;

    constructor(
        currentPage: PageElement,
        activeElement: PageNode | null,
        currentElement: PageElement,
        parentStack: PageElement[],
        pageIsFull: boolean
    ) {
        this.currentPage = currentPage;
        this.activeElement = activeElement;
        this.currentElement = currentElement;
        this.parentStack = parentStack;
        this.pageIsFull = pageIsFull;
    }

    public static create(currentPage: PageElement, parentStack: PageElement[]) {
        return new PageState(
            currentPage,
            null,
            currentPage,
            parentStack,
            false
        );
    }

    public clone = (): PageState => {
        return new PageState(
            this.currentPage,
            this.activeElement,
            this.currentElement,
            [...this.parentStack],
            this.pageIsFull
        );
    };
}

export class PageManager {
    private _pageState: PageState;
    private _pageSize: PageSize;
    private _transaction: Transaction;
    private _tempBook: Element;
    private _config: PaginationConfig;

    public constructor(
        tempBook: Element,
        pageSize: PageSize,
        transaction: Transaction,
        config: PaginationConfig
    ) {
        this._tempBook = tempBook;
        this._config = config;
        this._pageSize = pageSize;
        this._transaction = transaction;
        const page = this.createNewPage();

        this._pageState = PageState.create(page, []);
    }

    public nextPage(): void {
        const page = this.createNewPage();
        const newParentStack: PageElement[] = [];
        const newPageState = PageState.create(page, newParentStack);

        // add uncompleted parents elements to the new page
        this.cloneParentStackToNewPage(newPageState);
        this.cleanupEmptyParent();

        this._pageState = newPageState;
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
                if (parent.getNode().innerHTML === '') {
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

        logger.info(
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
        logger.info(logPrefix, 'leaving a parent element', popped);

        // find the original parent
        const parent = this._pageState.parentStack.at(-1);
        this._pageState.currentElement = parent ?? this._pageState.currentPage;
    }

    private createNewPage(): PageElement {
        const page = document.createElement('div');
        this._tempBook.appendChild(page);
        page.style.maxHeight = `${this._pageSize.height}px`;
        page.style.width = `${this._pageSize.width}px`;
        page.style.maxWidth = `${this._pageSize.width}px`;
        page.style.overflow = 'hidden';

        if (isInHighlightMode()) {
            page.classList.add(pageClassName);
        }

        if (this._transaction.isActive) {
            this._transaction.addRollbackCallback(() => {
                this._tempBook.removeChild(page);
            });
        }

        return createPageNode(page, this._transaction, this._config);
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
            this._pageState.currentPage.getHeight() + (elementHeight || 0) <=
                this._pageSize.height
        );
    }

    public isOverFlow(): boolean {
        return this._pageState.currentPage.getHeight() > this._pageSize.height;
    }

    public markPageAsFull(): void {
        this._pageState.pageIsFull = true;
    }

    public appendChild(node: PageElement, withChildren: boolean): PageElement {
        const clonedNode = node.clone(withChildren);

        unmarkCurrentNode(clonedNode);

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
}
