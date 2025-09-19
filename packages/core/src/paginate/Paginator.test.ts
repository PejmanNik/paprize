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
import { tempContainerClassName } from '../constants';
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
        config = { id: 'X' } as PaginationConfig;

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
                onVisitElement: (_id, _pe, _pm, ctx) => {
                    ctx.result = SplitResult.SplitChildren;
                },
            },
        ];

        const elementNode = { type: PageNodeType.Element } as PageElement;
        mockDomState.currentNode = elementNode;
        mockDomState.completed = false;

        mockDomState.nextNode.mockImplementation(() => {
            mockDomState.completed = true;
        });

        Paginator.paginate(root, pageSize, config);

        expect(mockDomState.nextNode).toBeCalledTimes(1);
        // The plugin result should have been used, so paginateElementAcrossPages should not be called
        expect(paginateElementAcrossPages).not.toHaveBeenCalled();
    });

    it('should return plugin result for text node if plugin sets ctx.result', () => {
        config.plugins = [
            {
                name: 'test-plugin',
                onVisitText: (_id, _pe, _pm, ctx) => {
                    ctx.result = SplitResult.SplitChildren;
                },
            },
        ];

        const textNode = { type: PageNodeType.Text } as PageText;
        mockDomState.currentNode = textNode;
        mockDomState.completed = false;

        mockDomState.nextNode.mockImplementation(() => {
            mockDomState.completed = true;
        });

        Paginator.paginate(root, pageSize, config);
        expect(mockDomState.nextNode).toBeCalledTimes(1);
        // The plugin result should have been used, so paginateTextByWord should not be called
        expect(paginateTextByWord).not.toHaveBeenCalled();
    });

    it('should use default config when input config is undefined', () => {
        Paginator.paginate(root, pageSize, config);
        expect(PageManager).toHaveBeenCalledWith(
            expect.anything(),
            expect.anything(),
            expect.anything(),
            { ...defaultConfig, ...config }
        );
        expect(DomState).toHaveBeenCalledWith(root, expect.anything(), {
            ...defaultConfig,
            ...config,
        });
    });

    it('should create a tempContainer element appended to the body and remove it', () => {
        const mockedAppendChild = vi.spyOn(document.body, 'appendChild');

        Paginator.paginate(root, pageSize, config);
        const tempContainer = document.body.querySelector(
            `.${tempContainerClassName}`
        );

        expect(mockedAppendChild).toHaveBeenCalled();
        expect(
            (mockedAppendChild.mock.calls[0][0] as Element).classList.contains(
                tempContainerClassName
            )
        ).toBe(true);
        expect(tempContainer).toBeNull();
    });

    it('paginate() returns empty array if there is no result', () => {
        const result = Paginator.paginate(root, pageSize, config);

        expect(result.length).toBe(0);
    });

    it('should handle text node pagination', () => {
        const textNode = { type: PageNodeType.Text } as PageText;

        mockDomState.currentNode = textNode;
        mockDomState.completed = true;

        vi.mocked(paginateTextByWord).mockReturnValue(
            SplitResult.FullNodePlaced
        );

        Paginator.paginate(root, pageSize, config);

        expect(paginateTextByWord).toHaveBeenCalledWith(
            textNode,
            mockPageManager
        );
        expect(mockDomState.nextNode).toHaveBeenCalledOnce();
    });

    it('should handle element node pagination', () => {
        const elementNode = { type: PageNodeType.Element } as PageElement;

        mockDomState.currentNode = elementNode;
        mockDomState.completed = true;
        vi.mocked(paginateElementAcrossPages).mockReturnValue(
            SplitResult.FullNodePlaced
        );

        Paginator.paginate(root, pageSize, config);

        expect(paginateElementAcrossPages).toHaveBeenCalledWith(
            elementNode,
            mockPageManager
        );
        expect(mockDomState.nextNode).toHaveBeenCalledOnce();
    });

    it('should handle node skipping when pagination returns None', () => {
        const node = { type: PageNodeType.Element } as PageElement;

        mockDomState.currentNode = node;
        mockDomState.completed = true;
        vi.mocked(paginateElementAcrossPages).mockReturnValue(SplitResult.None);

        Paginator.paginate(root, pageSize, config);

        expect(mockDomState.nextNode).toHaveBeenCalledTimes(2);
    });

    it('should handle split children scenario', () => {
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

        Paginator.paginate(root, pageSize, config);

        expect(mockPageManager.enterElement).toHaveBeenCalled();
    });

    it('should handle multiple parent traversals when placing full node', () => {
        const node = { type: PageNodeType.Element } as PageElement;

        mockDomState.currentNode = node;
        mockDomState.completed = true;
        vi.mocked(paginateElementAcrossPages).mockReturnValue(
            SplitResult.FullNodePlaced
        );
        mockDomState.nextSiblingOrParentSibling.mockReturnValue({
            parentsTraversed: 2,
        });

        Paginator.paginate(root, pageSize, config);

        expect(mockPageManager.leaveElement).toHaveBeenCalledTimes(2);
    });

    it('should call afterVisitNode plugin hook after each node visit', () => {
        const afterVisitNode = vi.fn();
        config.plugins = [
            {
                name: 'test-plugin',
                afterVisitNode,
            },
        ];

        // setup a node and make sure pagination completes after one iteration
        const node = { type: PageNodeType.Element } as PageElement;
        mockDomState.currentNode = node;
        mockDomState.completed = false;
        mockDomState.nextNode.mockImplementation(() => {
            mockDomState.completed = true;
        });
        vi.mocked(paginateElementAcrossPages).mockReturnValue(
            SplitResult.FullNodePlaced
        );

        Paginator.paginate(root, pageSize, config);

        expect(afterVisitNode).toHaveBeenCalledWith(
            config.id,
            mockDomState,
            mockPageManager
        );
        expect(afterVisitNode).toHaveBeenCalledTimes(1);
    });
});
