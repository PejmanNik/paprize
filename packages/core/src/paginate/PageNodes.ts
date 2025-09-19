import { getVisibleHeight, isElement, isTextNode } from './domUtilities';
import { type PaginationConfig } from './PaginationConfig';
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
    private readonly _transaction: Transaction;

    public readonly type: 'element' = PageNodeType.Element;
    public readonly config: PaginationConfig;

    constructor(
        element: Element,
        transaction: Transaction,
        config: PaginationConfig
    ) {
        this._node = element;
        this._transaction = transaction;
        this.config = config;
    }

    appendChild(node: PageNode): void {
        if (this._transaction.isActive) {
            this._transaction.addRollbackCallback(() => {
                this._node.removeChild(node.getNode() as Node);
            });
        }

        this._node.appendChild(node.getNode() as Node);
    }

    clone(withChildren?: boolean): PageElement {
        const clonedElement = this._node.cloneNode(withChildren) as Element;
        const clonedPageElement = new PageElement(
            clonedElement,
            this._transaction,
            this.config
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
        this._transaction.addCommitCallback(() => {
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
    private readonly _transaction: Transaction;

    public readonly type: 'text' = PageNodeType.Text;
    public readonly config: PaginationConfig;

    constructor(
        text: Text,
        transaction: Transaction,
        config: PaginationConfig
    ) {
        this._node = text;
        this._transaction = transaction;
        this.config = config;
    }

    get textContent(): string {
        return this._node.textContent ?? '';
    }

    set textContent(value: string) {
        this._node.textContent = value;
    }

    remove(): void {
        this._transaction.addCommitCallback(() => {
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
    config: PaginationConfig
): PageElement;
export function createPageNode(
    node: Text,
    transaction: Transaction,
    config: PaginationConfig
): PageText;
export function createPageNode(
    node: Node,
    transaction: Transaction,
    config: PaginationConfig
): PageNode;
export function createPageNode(
    node: Node,
    transaction: Transaction,
    config: PaginationConfig
): PageNode {
    if (isTextNode(node)) {
        return new PageText(node, transaction, config);
    } else if (isElement(node)) {
        return new PageElement(node, transaction, config);
    }

    throw new Error('Unsupported node type');
}
