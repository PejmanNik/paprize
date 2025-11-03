import { getVisibleHeight, isElement, isTextNode } from './domUtilities';
import { type PaginationOptions } from './PaginationOptions';
import { callPluginHook } from './PaginationPlugin';
import type { Transaction } from './Transaction';

export type SafeElement = Omit<
    Element,
    'removeChild' | 'appendChild' | 'replaceChild' | 'remove'
>;

export type SafeText = Omit<Text, 'remove'>;

export const PageNodeType = {
    Element: 'element',
    Text: 'text',
} as const;

export class PageElement {
    private readonly _node: Element;

    public config: PaginationOptions;

    public readonly type: 'element' = PageNodeType.Element;
    public readonly transaction: Transaction;
    public readonly clonedFrom?: PageElement;
    public readonly cloneCount: number;

    constructor(
        element: Element,
        transaction: Transaction,
        config: PaginationOptions,
        clonedFrom?: PageElement
    ) {
        this._node = element;
        this.transaction = transaction;
        this.config = config;
        this.clonedFrom = clonedFrom;
        this.cloneCount = clonedFrom ? clonedFrom.cloneCount + 1 : 0;
    }

    getOriginalNode(): Node | undefined {
        let current: PageElement | undefined = this.clonedFrom;
        while (current?.clonedFrom) {
            current = current.clonedFrom;
        }
        return current?._node;
    }

    appendChild(node: PageNode): void {
        if (this.transaction.isActive) {
            this.transaction.addRollbackCallback(() => {
                this._node.removeChild(node.getNode() as Node);
            });
        }

        this._node.appendChild(node.getNode() as Node);
    }

    clone(withChildren?: boolean): PageElement {
        const clonedElement = this._node.cloneNode(withChildren) as Element;
        const clonedPageElement = new PageElement(
            clonedElement,
            this.transaction,
            this.config,
            this
        );

        callPluginHook(
            this.config.plugins,
            'onClone',
            this.config.id,
            this._node,
            clonedPageElement
        );

        return clonedPageElement;
    }

    getHeight(): number {
        return getVisibleHeight(this._node);
    }

    remove(): void {
        this.transaction.addCommitCallback(() => {
            this._node.remove();
        });
    }

    isEmpty(): boolean {
        return this._node.innerHTML === '';
    }

    getChildrenCount(): number {
        return this._node.childNodes.length;
    }

    getNode(): SafeElement {
        return this._node;
    }
}

export class PageText {
    private readonly _node: Text;

    public readonly type: 'text' = PageNodeType.Text;
    public readonly transaction: Transaction;

    public config: PaginationOptions;

    constructor(
        text: Text,
        transaction: Transaction,
        config: PaginationOptions
    ) {
        this._node = text;
        this.transaction = transaction;
        this.config = config;
    }

    get textContent(): string {
        return this._node.textContent ?? '';
    }

    set textContent(value: string) {
        this._node.textContent = value;
    }

    remove(): void {
        this.transaction.addCommitCallback(() => {
            this._node.remove();
        });
    }

    getNode(): SafeText {
        return this._node;
    }
}

export type PageNode = PageElement | PageText;

export function createPageNode(
    node: Element,
    transaction: Transaction,
    config: PaginationOptions
): PageElement;
export function createPageNode(
    node: Text,
    transaction: Transaction,
    config: PaginationOptions
): PageText;
export function createPageNode(
    node: Node,
    transaction: Transaction,
    config: PaginationOptions
): PageNode;
export function createPageNode(
    node: Node,
    transaction: Transaction,
    config: PaginationOptions
): PageNode {
    if (isTextNode(node)) {
        return new PageText(node, transaction, config);
    } else if (isElement(node)) {
        return new PageElement(node, transaction, config);
    }

    throw new Error('Unsupported node type');
}
