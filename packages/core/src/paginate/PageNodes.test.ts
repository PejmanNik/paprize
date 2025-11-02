import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
    PageElement,
    PageText,
    createPageNode,
    PageNodeType,
} from './PageNodes';
import { Transaction } from './Transaction';
import { defaultPaginationOptions } from './PaginationOptions';
import * as DomUtilities from './domUtilities';
import type { PaginationPlugin } from './PaginationPlugin';

describe('PageElement', () => {
    let element: Element;
    let transaction: Transaction;

    beforeEach(() => {
        element = document.createElement('div');
        transaction = new Transaction();
    });

    it('should set the type property to "element" upon initialization', () => {
        const pageElem = new PageElement(
            element,
            transaction,
            defaultPaginationOptions
        );
        expect(pageElem.type).toBe(PageNodeType.Element);
    });

    it('should append a child node to the element when appendChild is called', () => {
        const pageElem = new PageElement(
            element,
            transaction,
            defaultPaginationOptions
        );
        const childElem = document.createElement('span');
        const childPageElem = new PageElement(
            childElem,
            transaction,
            defaultPaginationOptions
        );

        pageElem.appendChild(childPageElem);

        expect(element.childNodes[0]).toBe(childElem);
    });

    it('should remove an appended child if the transaction rolls back', () => {
        transaction.start();
        const pageElem = new PageElement(
            element,
            transaction,
            defaultPaginationOptions
        );
        const childElem = document.createElement('span');
        const childPageElem = new PageElement(
            childElem,
            transaction,
            defaultPaginationOptions
        );
        pageElem.appendChild(childPageElem);

        expect(element.contains(childElem)).toBe(true);

        // remove child on rollback
        transaction.rollback();
        expect(element.contains(childElem)).toBe(false);
    });

    it('should create a cloned PageElement with a different underlying node', () => {
        const pageElem = new PageElement(
            element,
            transaction,
            defaultPaginationOptions
        );
        const clone = pageElem.clone();

        expect(clone).toBeInstanceOf(PageElement);
        expect(clone.getNode()).not.toBe(pageElem.getNode());
    });

    it('should keep the link to parent for a cloned PageElement', () => {
        const pageElem = new PageElement(
            element,
            transaction,
            defaultPaginationOptions
        );
        const clone = pageElem.clone();

        expect(clone).toBeInstanceOf(PageElement);
        expect(clone.clonedFrom).toBe(pageElem);
        expect(clone.cloneCount).toBe(pageElem.cloneCount + 1);
    });

    it('should return the original element when getOriginalNode is called', () => {
        const pageElem = new PageElement(
            element,
            transaction,
            defaultPaginationOptions
        );
        const clone1 = pageElem.clone();
        const clone2 = clone1.clone();

        expect(clone2.getOriginalNode()).toBe(pageElem.getNode());
        expect(clone1.getOriginalNode()).toBe(pageElem.getNode());
        expect(clone2.cloneCount).toBe(pageElem.cloneCount + 2);
    });

    it('should call plugins on clone', () => {
        const plugin1 = { onClone: vi.fn() } as unknown as PaginationPlugin;
        const plugin2 = { onClone: vi.fn() } as unknown as PaginationPlugin;

        const pageElem = new PageElement(element, transaction, {
            ...defaultPaginationOptions,
            plugins: [plugin1, plugin2],
        });
        const clone = pageElem.clone();

        expect(plugin1.onClone).toHaveBeenCalledWith(
            defaultPaginationOptions.id,
            pageElem.getNode(),
            clone
        );
        expect(plugin2.onClone).toHaveBeenCalledWith(
            defaultPaginationOptions.id,
            pageElem.getNode(),
            clone
        );
    });

    it('should return the correct number of children for the element', () => {
        const pageElem = new PageElement(
            element,
            transaction,
            defaultPaginationOptions
        );
        element.appendChild(document.createElement('span'));
        element.appendChild(document.createTextNode('text'));

        expect(pageElem.getChildrenCount()).toBe(2);
    });

    it('should remove the child node from the element when remove is called', () => {
        const pageElem = new PageElement(
            element,
            transaction,
            defaultPaginationOptions
        );
        const childElem = document.createElement('span');
        const childPageElem = new PageElement(
            childElem,
            transaction,
            defaultPaginationOptions
        );
        pageElem.appendChild(childPageElem);

        childPageElem.remove();
        expect(element.contains(childElem)).toBe(false);
    });

    it('should only remove the node from the element after transaction commit', () => {
        transaction.start();
        const pageElem = new PageElement(
            element,
            transaction,
            defaultPaginationOptions
        );
        const childElem = document.createElement('span');
        const childPageElem = new PageElement(
            childElem,
            transaction,
            defaultPaginationOptions
        );
        pageElem.appendChild(childPageElem);

        childPageElem.remove();
        expect(element.contains(childElem)).toBe(true);

        transaction.commit();
        expect(element.contains(childElem)).toBe(false);
    });

    it('should return the underlying element node with getNode', () => {
        const pageElem = new PageElement(
            element,
            transaction,
            defaultPaginationOptions
        );
        expect(pageElem.getNode()).toBe(element);
    });

    it('should return the element hight', () => {
        const pageElem = new PageElement(
            element,
            transaction,
            defaultPaginationOptions
        );

        const nodeHeight = 9;
        vi.spyOn(DomUtilities, 'getVisibleHeight').mockReturnValue(nodeHeight);

        expect(pageElem.getHeight()).toBe(nodeHeight);
    });

    it('should return true when element is empty', () => {
        const pageElem = new PageElement(
            element,
            transaction,
            defaultPaginationOptions
        );

        expect(pageElem.isEmpty()).toBe(true);
    });

    it('should return false when element is not empty', () => {
        element.appendChild(document.createTextNode('text'));
        const pageElem = new PageElement(
            element,
            transaction,
            defaultPaginationOptions
        );

        expect(pageElem.isEmpty()).toBe(false);
    });
});

describe('PageText', () => {
    let text: Text;
    let transaction: Transaction;

    beforeEach(() => {
        text = document.createTextNode('hello');
        transaction = new Transaction();
    });

    it('should set the type property to "text" upon initialization', () => {
        const pageText = new PageText(
            text,
            transaction,
            defaultPaginationOptions
        );
        expect(pageText.type).toBe(PageNodeType.Text);
    });

    it('should get and set the textContent property correctly', () => {
        const pageText = new PageText(
            text,
            transaction,
            defaultPaginationOptions
        );
        expect(pageText.textContent).toBe('hello');
        pageText.textContent = 'world';
        expect(pageText.textContent).toBe('world');
    });

    it('should remove the text node from its parent when remove is called', () => {
        const element = document.createElement('div');
        const pageElem = new PageElement(
            element,
            transaction,
            defaultPaginationOptions
        );
        const pageText = new PageText(
            text,
            transaction,
            defaultPaginationOptions
        );
        pageElem.appendChild(pageText);

        pageText.remove();
        expect(element.contains(text)).toBe(false);
    });

    it('should only remove the text node after transaction commit', () => {
        transaction.start();
        const element = document.createElement('div');
        const pageElem = new PageElement(
            element,
            transaction,
            defaultPaginationOptions
        );
        const pageText = new PageText(
            text,
            transaction,
            defaultPaginationOptions
        );
        pageElem.appendChild(pageText);

        pageText.remove();
        expect(element.contains(text)).toBe(true);

        transaction.commit();
        expect(element.contains(text)).toBe(false);
    });

    it('should return the underlying text node with getNode', () => {
        const pageText = new PageText(
            text,
            transaction,
            defaultPaginationOptions
        );
        expect(pageText.getNode()).toBe(text);
    });

    it('should return empty string when text is null', () => {
        const pageText = new PageText(
            vi.fn().mockImplementation(() => ({
                textContent: null,
            })) as unknown as Text,
            transaction,
            defaultPaginationOptions
        );
        expect(pageText.textContent).toBe('');
    });
});

describe('createPageNode', () => {
    let transaction: Transaction;

    beforeEach(() => {
        transaction = new Transaction();
    });

    it('should return a PageElement instance when given an Element node', () => {
        const elem = document.createElement('div');
        const pageNode = createPageNode(
            elem,
            transaction,
            defaultPaginationOptions
        );
        expect(pageNode).toBeInstanceOf(PageElement);
    });

    it('should return a PageText instance when given a Text node', () => {
        const text = document.createTextNode('test');
        const pageNode = createPageNode(
            text,
            transaction,
            defaultPaginationOptions
        );
        expect(pageNode).toBeInstanceOf(PageText);
    });

    it('should throw an error when given an unsupported node type', () => {
        const comment = document.createComment('test');
        expect(() =>
            createPageNode(comment, transaction, defaultPaginationOptions)
        ).toThrow('Unsupported node type');
    });
});
