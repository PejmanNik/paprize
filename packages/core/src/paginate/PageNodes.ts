import { getTotalHeight, isElement, isTextNode } from './domUtilities';
import { triggerPlugins, type PaginationConfig } from './PaginationConfig';
import type { Transaction } from './Transaction';

export type SafeElement = Omit<
    Element,
    'removeChild' | 'appendChild' | 'replaceChild' | 'cloneNode' | 'remove'
>;

export type SafeText = Omit<Text, 'remove'>;

export const PageNodeType = {
    Element: 'element',
    Text: 'text',
} as const;

export class PageElement {
    private _node: Element;
    private _transaction: Transaction;

    public type: 'element' = PageNodeType.Element;
    public config: PaginationConfig;

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

        triggerPlugins(this.config.plugins, (plugin) => {
            plugin.onClone(this._node, clonedPageElement);
        });

        return clonedPageElement;
    }

    getHeight(): number {
        return getTotalHeight(this._node);
    }

    remove(): void {
        this._transaction.addCommitCallback(() => {
            this._node.remove();
        });
    }

    getChildrenCount(): number {
        return this._node.childNodes.length;
    }

    getNode(): SafeElement {
        return this._node;
    }
}

export class PageText {
    private _node: Text;
    private _transaction: Transaction;

    public type: 'text' = PageNodeType.Text;
    public config: PaginationConfig;

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
        return this._node.textContent;
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
