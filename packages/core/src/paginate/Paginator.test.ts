import {
    describe,
    it,
    expect,
    beforeEach,
    vi,
    type MockInstance,
    type Mock,
} from 'vitest';
import { Paginator } from './Paginator';
import { PageManager } from './PageManager';
import { DomState } from './DomState';
import { PageElement, PageNodeType, PageText } from './PageNodes';
import { SplitResult } from './SplitResult';
import type { PageSize } from './PageSize';
import { defaultConfig, type PaginationConfig } from './PaginationConfig';
import { tempBookClassName } from '../constants';
import { paginateTextByWord } from './paginateText';
import { paginateElementAcrossPages } from './paginateElement';

vi.mock('./DomState');
vi.mock('./PageManager');
vi.mock('./Transaction');
vi.mock('./paginateElement');
vi.mock('./paginateText');
vi.mock('../utilities/pageNodeMarker', () => ({
    markIgnoredNode: vi.fn(),
}));

describe('Paginator', () => {
    let root: Element;
    let pageSize: PageSize;
    let config: PaginationConfig;
    let paginator: Paginator;

    let mockDomState: {
        nextNode: Mock;
        currentNode: PageElement | PageText | null;
        completed: boolean;
        nextSiblingOrParentSibling: MockInstance;
        firstChildOrNextNode: MockInstance;
        previousNode: PageElement | null;
    };
    let mockPageManager: {
        enterElement: MockInstance;
        leaveElement: MockInstance;
    };

    beforeEach(() => {
        document.body.innerHTML = '';
        root = document.createElement('div');
        pageSize = { width: 100, height: 100 };
        config = {} as PaginationConfig;

        mockDomState = {
            nextNode: vi.fn(),
            currentNode: null,
            completed: true,
            nextSiblingOrParentSibling: vi
                .fn()
                .mockReturnValue({ parentsTraversed: 0 }),
            firstChildOrNextNode: vi
                .fn()
                .mockReturnValue({ parentsTraversed: 0 }),
            previousNode: null,
        };

        mockPageManager = {
            enterElement: vi.fn(),
            leaveElement: vi.fn(),
        };

        vi.mocked(DomState).mockImplementation(
            () => mockDomState as unknown as DomState
        );
        vi.mocked(PageManager).mockImplementation(
            () => mockPageManager as unknown as PageManager
        );
    });

    it('should return plugin result for element node if plugin sets ctx.result', () => {
        config.plugins = [
            {
                name: 'test-plugin',
                onVisitElement: (_pe, _pm, ctx) => {
                    ctx.result = SplitResult.SplitChildren;
                },
            },
        ];

        paginator = new Paginator(root, pageSize, config);
        const elementNode = { type: PageNodeType.Element } as PageElement;
        mockDomState.currentNode = elementNode;
        mockDomState.completed = false;

        mockDomState.nextNode.mockImplementation(() => {
            mockDomState.completed = true;
        });

        paginator.paginate();
        expect(mockDomState.nextNode).toBeCalledTimes(1);
        // The plugin result should have been used, so paginateElementAcrossPages should not be called
        expect(paginateElementAcrossPages).not.toHaveBeenCalled();
    });

    it('should return plugin result for text node if plugin sets ctx.result', () => {
        config.plugins = [
            {
                name: 'test-plugin',
                onVisitText: (_pe, _pm, ctx) => {
                    ctx.result = SplitResult.SplitChildren;
                },
            },
        ];
        paginator = new Paginator(root, pageSize, config);
        const textNode = { type: PageNodeType.Text } as PageText;
        mockDomState.currentNode = textNode;
        mockDomState.completed = false;

        mockDomState.nextNode.mockImplementation(() => {
            mockDomState.completed = true;
        });

        paginator.paginate();
        expect(mockDomState.nextNode).toBeCalledTimes(1);
        // The plugin result should have been used, so paginateTextByWord should not be called
        expect(paginateTextByWord).not.toHaveBeenCalled();
    });

    it('should use default config when input config is undifind', () => {
        paginator = new Paginator(root, pageSize);

        expect(PageManager).toHaveBeenCalledWith(
            expect.anything(),
            expect.anything(),
            expect.anything(),
            defaultConfig
        );
        expect(DomState).toHaveBeenCalledWith(
            root,
            expect.anything(),
            defaultConfig
        );
    });

    it('should create a tempBook element appended to the body', () => {
        paginator = new Paginator(root, pageSize, config);
        const tempBook = document.body.querySelector(`.${tempBookClassName}`);

        expect(tempBook).not.toBeNull();
        expect(tempBook?.childNodes.length).toBe(0);
    });

    it('paginate() returns hasPage true and a firstPage element, and dispose removes tempBook', () => {
        paginator = new Paginator(root, pageSize, config);

        const tempBook = document.body.querySelector(`.${tempBookClassName}`);
        const element = document.createElement('div');
        element.textContent = 'Test content';
        tempBook?.appendChild(element);

        const result = paginator.paginate();

        expect(result.pages.length).toBe(1);
        expect(tempBook?.childNodes.length).toBe(1);

        // call dispose, the tempBook should be removed from DOM
        result.dispose();
        expect(document.body.contains(tempBook)).toBe(false);
    });

    it('paginate() returns hasPage false if there is no firstChild', () => {
        paginator = new Paginator(root, pageSize, config);

        const result = paginator.paginate();

        expect(result.pages.length).toBe(0);
    });

    it('should handle text node pagination', () => {
        paginator = new Paginator(root, pageSize, config);
        const textNode = { type: PageNodeType.Text } as PageText;

        mockDomState.currentNode = textNode;
        mockDomState.completed = true;

        vi.mocked(paginateTextByWord).mockReturnValue(
            SplitResult.FullNodePlaced
        );

        paginator.paginate();

        expect(paginateTextByWord).toHaveBeenCalledWith(
            textNode,
            mockPageManager
        );
        expect(mockDomState.nextNode).toHaveBeenCalledOnce();
    });

    it('should handle element node pagination', () => {
        paginator = new Paginator(root, pageSize, config);
        const elementNode = { type: PageNodeType.Element } as PageElement;

        mockDomState.currentNode = elementNode;
        mockDomState.completed = true;
        vi.mocked(paginateElementAcrossPages).mockReturnValue(
            SplitResult.FullNodePlaced
        );

        paginator.paginate();

        expect(paginateElementAcrossPages).toHaveBeenCalledWith(
            elementNode,
            mockPageManager
        );
        expect(mockDomState.nextNode).toHaveBeenCalledOnce();
    });

    it('should handle node skipping when pagination returns None', () => {
        paginator = new Paginator(root, pageSize, config);
        const node = { type: PageNodeType.Element } as PageElement;

        mockDomState.currentNode = node;
        mockDomState.completed = true;
        vi.mocked(paginateElementAcrossPages).mockReturnValue(SplitResult.None);

        paginator.paginate();

        expect(mockDomState.nextNode).toHaveBeenCalledTimes(2);
    });

    it('should handle split children scenario', () => {
        paginator = new Paginator(root, pageSize, config);
        const elementNode = { type: PageNodeType.Element } as PageElement;

        mockDomState.currentNode = elementNode;
        mockDomState.previousNode = {
            type: PageNodeType.Element,
        } as PageElement;
        mockDomState.completed = true;

        vi.mocked(paginateElementAcrossPages).mockReturnValue(
            SplitResult.SplitChildren
        );
        mockDomState.firstChildOrNextNode.mockReturnValue({
            parentsTraversed: 1,
        });

        paginator.paginate();

        expect(mockPageManager.enterElement).toHaveBeenCalled();
    });

    it('should handle multiple parent traversals when placing full node', () => {
        paginator = new Paginator(root, pageSize, config);
        const node = { type: PageNodeType.Element } as PageElement;

        mockDomState.currentNode = node;
        mockDomState.completed = true;
        vi.mocked(paginateElementAcrossPages).mockReturnValue(
            SplitResult.FullNodePlaced
        );
        mockDomState.nextSiblingOrParentSibling.mockReturnValue({
            parentsTraversed: 2,
        });

        paginator.paginate();

        expect(mockPageManager.leaveElement).toHaveBeenCalledTimes(2);
    });
});
