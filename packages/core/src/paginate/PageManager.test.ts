import { describe, expect, vi, beforeEach, type Mocked, test } from 'vitest';
import { PageManager } from './PageManager';
import type { PaginationConfig } from './PaginationConfig';
import { Transaction } from './Transaction';
import {
    type PageElement,
    PageNodeType,
    PageText,
    createPageNode,
} from './PageNodes';

vi.mock('./PageNodes');
vi.mock('../debugUtilities/pageNodeMarker');
vi.mock('../debugUtilities/debugMode', () => ({
    isDebugMode: vi.fn().mockReturnValue(false),
}));

function createMockPageElement(): Mocked<PageElement> {
    const mocked = {
        getHeight: vi.fn().mockReturnValue(0),
        appendChild: vi.fn(),
        clone: vi.fn(),
        getNode: vi.fn(),
        remove: vi.fn(),
        isEmpty: vi.fn().mockReturnValue(false),
        type: PageNodeType.Element,
    } as unknown as Mocked<PageElement>;

    mocked.clone.mockReturnValue(mocked);

    return mocked;
}

describe('PageManager', () => {
    let tempContainer: Element;
    let pageManager: PageManager;
    let mockPageElement: Mocked<PageElement>;
    const pageSize = { width: 800, height: 1000 };

    beforeEach(() => {
        const transaction = new Transaction();
        const config = { plugins: [] } as unknown as PaginationConfig;

        vi.clearAllMocks();

        tempContainer = document.createElement('section');

        mockPageElement = createMockPageElement();

        vi.mocked(createPageNode).mockReturnValue(mockPageElement);

        pageManager = new PageManager(
            tempContainer,
            pageSize,
            transaction,
            config
        );
    });

    describe('hasEmptySpace', () => {
        test('should return false when page is marked as full regardless of height', () => {
            mockPageElement.getHeight.mockReturnValue(100);
            pageManager.markPageAsFull();

            expect(pageManager.hasEmptySpace(1)).toBe(false);
        });

        test('should return true when there is space and no element height provided', () => {
            mockPageElement.getHeight.mockReturnValue(pageSize.height - 100);

            expect(pageManager.hasEmptySpace(10)).toBe(true);
        });

        test('should return true when element height fits in remaining space', () => {
            mockPageElement.getHeight.mockReturnValue(pageSize.height - 200);

            expect(pageManager.hasEmptySpace(200)).toBe(true);
        });

        test('should return false when element height exceeds remaining space', () => {
            mockPageElement.getHeight.mockReturnValue(pageSize.height - 400);

            expect(pageManager.hasEmptySpace(700)).toBe(false);
        });

        test('should return false when current height equals page height', () => {
            mockPageElement.getHeight.mockReturnValue(pageSize.height);

            expect(pageManager.hasEmptySpace()).toBe(false);
        });
    });

    describe('nextPage', () => {
        beforeEach(() => {
            mockPageElement.getNode.mockImplementation(
                () => tempContainer.lastElementChild as Element
            );
        });

        test('should create a new page with correct styles', () => {
            pageManager.nextPage();

            const page = tempContainer.lastElementChild;
            const style = (page as HTMLDivElement).style;

            expect(style.width).toBe(`${pageSize.width}px`);
            expect(style.maxWidth).toBe(`${pageSize.width}px`);
        });

        test('should clone parent stack to new page', () => {
            // enter an element to create parent stack
            pageManager.appendChild(mockPageElement, false);
            pageManager.enterElement();

            mockPageElement.clone.mockReturnValue(mockPageElement);

            pageManager.nextPage();
            expect(mockPageElement.clone).toHaveBeenCalledWith(false);
            expect(mockPageElement.appendChild).toHaveBeenCalled();
        });

        test('should cleanup empty parents', () => {
            // setup parent stack
            mockPageElement.isEmpty.mockReturnValue(true);
            pageManager.appendChild(mockPageElement, false);
            pageManager.enterElement();

            pageManager.nextPage();

            expect(mockPageElement.isEmpty).toHaveBeenCalled();
            expect(mockPageElement.remove).toHaveBeenCalled();
        });
    });

    describe('enterElement and leaveElement', () => {
        test('should enter and leave element correctly', () => {
            const parentNode = document.createElement('div');
            const parentElement = createMockPageElement();
            parentElement.getNode.mockReturnValue(parentNode);
            parentElement.clone.mockReturnValue(parentElement);

            const childElement = createMockPageElement();
            const childNode = document.createElement('div');
            childElement.getNode.mockReturnValue(childNode);
            childElement.clone.mockReturnValue(childElement);

            const childElement2 = createMockPageElement();
            const childNode2 = document.createElement('div');
            childElement2.getNode.mockReturnValue(childNode2);
            childElement2.clone.mockReturnValue(childElement2);

            pageManager.appendChild(parentElement, false);

            // enter element
            pageManager.enterElement();

            pageManager.appendChild(childElement, false);

            // leave element and fall back to parent or page
            pageManager.leaveElement();

            pageManager.appendChild(childElement2, false);

            expect(parentElement.appendChild).toHaveBeenCalledExactlyOnceWith(
                childElement
            );
            expect(mockPageElement.appendChild).toHaveBeenCalledWith(
                childElement2
            );
        });

        test('should throw error when entering invalid element', () => {
            vi.mocked(createPageNode).mockReturnValue({
                type: PageNodeType.Text,
                textContent: '',
            } as unknown as PageText);

            // create a text node instead of an element
            // this sets a text node as active element
            pageManager.addTextNode('test');

            expect(() => pageManager.enterElement()).toThrow(
                'Invalid state: activeElement is not an Element'
            );
        });
    });

    describe('startTransaction', () => {
        test('should start transaction and provide rollback and commit functions', () => {
            const { rollback, commit } = pageManager.startTransaction();

            expect(typeof rollback).toBe('function');
            expect(typeof commit).toBe('function');
        });
    });

    describe('isOverFlow', () => {
        test('should return true when page height exceeds max height', () => {
            mockPageElement.getHeight.mockReturnValue(1200);
            expect(pageManager.isOverFlow()).toBe(true);
        });

        test('should return false when page height is within limits', () => {
            mockPageElement.getHeight.mockReturnValue(800);
            expect(pageManager.isOverFlow()).toBe(false);
        });
    });

    describe('appendChild', () => {
        test('should clone and append node', () => {
            mockPageElement.clone.mockReturnValue(mockPageElement);

            const result = pageManager.appendChild(mockPageElement, true);

            expect(mockPageElement.clone).toHaveBeenCalledWith(true);
            expect(mockPageElement.appendChild).toHaveBeenCalled();
            expect(result).toBe(mockPageElement);
        });
    });

    describe('addTextNode', () => {
        test('should create and append text node when no active text node exists', () => {
            const text = 'Hello World';
            const result = pageManager.addTextNode(text);

            expect(mockPageElement.appendChild).toHaveBeenCalled();
            expect(result).toBe(mockPageElement);
        });

        test('should return existing text node when active node is text node', () => {
            const text = 'Hello World';

            // set up a text node as active element
            vi.mocked(createPageNode).mockReturnValue({
                type: PageNodeType.Text,
            } as unknown as PageElement);

            // first add a text node
            const firstResult = pageManager.addTextNode(text);

            // adding text node when active element is already a text node
            const result = pageManager.addTextNode(text);
            expect(result).toBe(firstResult);
        });
    });

    describe('transaction rollback coverage', () => {
        let transaction: Mocked<Transaction>;

        beforeEach(() => {
            transaction = {
                start: vi.fn(),
                commit: vi.fn(),
                rollback: vi.fn(),
                addRollbackCallback: vi.fn(),
                addCommitCallback: vi.fn(),
                isActive: false,
            } as unknown as Mocked<Transaction>;
            const config = { plugins: [] } as unknown as PaginationConfig;
            tempContainer = document.createElement('section');
            pageManager = new PageManager(
                tempContainer,
                pageSize,
                transaction,
                config
            );
        });
        test('should remove page from tempContainer on transaction rollback', () => {
            transaction.isActive = true;
            const callbacks: Function[] = [];
            transaction.addRollbackCallback.mockImplementation((cb) =>
                callbacks.push(cb)
            );

            mockPageElement.getNode.mockImplementation(
                () => tempContainer.lastElementChild as Element
            );

            // call nextPage to trigger createNewPage with active transaction
            pageManager.nextPage();
            expect(transaction.addRollbackCallback).toHaveBeenCalled();

            expect(tempContainer.childElementCount).toBe(2);

            callbacks.forEach((cb) => cb());
            expect(tempContainer.childElementCount).toBe(1);
        });

        test('should restore previous pageState on transaction rollback', () => {
            transaction.isActive = true;
            const callbacks: Function[] = [];
            transaction.addRollbackCallback.mockImplementation((cb) =>
                callbacks.push(cb)
            );

            pageManager.startTransaction();
            pageManager.markPageAsFull();

            callbacks.forEach((cb) => cb());

            expect(pageManager.hasEmptySpace()).toBe(true);
        });
    });

    describe('getPageState', () => {
        test('should return the current page state', () => {
            expect(pageManager.getPageState()).toBeInstanceOf(Object);
            expect(pageManager.getPageState().pageIndex).toBe(0);
        });
    });
});
