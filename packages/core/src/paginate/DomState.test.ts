import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DomState } from './DomState';
import * as PageNodes from './PageNodes';
import { Transaction } from './Transaction';
import { type PaginationConfig, defaultConfig } from './PaginationConfig';

vi.mock('../utilities/pageNodeMarker', () => ({
    markCurrentNode: vi.fn(),
    unmarkCurrentNode: vi.fn(),
}));

function makeTree() {
    /**
     * <div id="root">
     *   #text "a"
     *   <div id="e1">
     *     <div id="e2">
     *       <p id="e3">
     *         #text "b"
     *       </p>
     *       <p id="e4">
     *         #text "c"
     *       </p>
     *     </div>
     *   </div>
     *   <span id="e5">
     *     #text "d"
     *   </span>
     * </div>
     */
    const root = document.createElement('div');
    root.id = 'root';
    root.appendChild(document.createTextNode('a'));

    const div1 = document.createElement('div');
    div1.id = 'e1';

    const div2 = document.createElement('div');
    div2.id = 'e2';

    const p3 = document.createElement('p');
    p3.id = 'e3';
    p3.appendChild(document.createTextNode('b'));

    const p4 = document.createElement('p');
    p4.id = 'e4';
    p4.appendChild(document.createTextNode('c'));

    div2.appendChild(p3);
    div2.appendChild(p4);
    div1.appendChild(div2);
    root.appendChild(div1);

    const span5 = document.createElement('span');
    span5.id = 'e5';
    span5.appendChild(document.createTextNode('d'));
    root.appendChild(span5);

    return root;
}

describe('DomState', () => {
    let root: HTMLDivElement;
    let transaction: Transaction;
    let config: PaginationConfig;
    let domState: DomState;

    beforeEach(() => {
        root = makeTree();
        transaction = new Transaction();
        config = defaultConfig;

        vi.spyOn(PageNodes, 'createPageNode').mockImplementation((node) => {
            return {
                getNode: () => node,
            } as PageNodes.PageNode;
        });

        domState = new DomState(root, transaction, config);
    });

    it('initializes with correct state', () => {
        expect(domState.completed).toBe(false);
        expect(domState.currentNode).toBeNull();
        expect(domState.previousNode).toBeNull();
    });

    it('nextNode moves to next node', () => {
        domState.goToNextNode();
        expect(domState.completed).toBe(false);
        expect(PageNodes.createPageNode).toHaveBeenCalled();

        // root.firstChild is #text "a"
        expect(domState.currentNode?.getNode()).toBe(root.firstChild);
    });

    it('nextNode sets completed to true at the end', () => {
        // traverse all nodes in the new tree
        for (let i = 0; i < 10; i++) domState.goToNextNode();
        expect(domState.completed).toBe(true);
    });

    it('firstChildOrNextNode prefers first child', () => {
        domState.goToFirstChildOrNextNode();
        expect(PageNodes.createPageNode).toHaveBeenCalled();
        // root.firstChild is #text "a"
        expect(domState.currentNode?.getNode()).toBe(root.firstChild);
    });

    it('firstChildOrNextNode falls back to nextNode if no children', () => {
        domState.goToNextNode(); // move to #text "a"
        domState.goToFirstChildOrNextNode();
        expect(domState.completed).toBe(false);
        // nextNode should move to div#1
        expect(domState.currentNode?.getNode()).toBe(root.querySelector('#e1'));
    });

    it('nextSiblingOrParentSibling goes to next sibling', () => {
        domState.goToNextNode(); // #text "a"
        domState.goToNextNode(); // div#1
        domState.goToNextNode(); // div#2
        domState.goToNextNode(); // p#3
        const result = domState.goToNextSiblingOrParentSibling(); // should go up to p#4
        expect(result.parentsTraversed).toBe(0);
        expect(domState.currentNode?.getNode()).toBe(root.querySelector('#e4'));
    });

    it('nextSiblingOrParentSibling goes to parent next sibling when no sibling', () => {
        domState.goToNextNode(); // #text "a"
        domState.goToNextNode(); // div#1
        domState.goToNextNode(); // div#2
        domState.goToNextNode(); // p#3
        domState.goToNextNode(); // #text "b"
        domState.goToNextNode(); // p#4
        const result = domState.goToNextSiblingOrParentSibling();

        expect(result.parentsTraversed).toBe(2); // traversed up 2 parents - div#2 and div#1
        expect(domState.currentNode?.getNode()).toBe(root.querySelector('#e5'));
    });

    it('nextSiblingOrParentSibling sets completed if at end', () => {
        // traverse to the last node (#text "d")
        for (let i = 0; i < 9; i++) domState.goToNextNode();
        domState.goToNextSiblingOrParentSibling();
        expect(domState.completed).toBe(true);
    });

    it('updates previousNode and currentNode', () => {
        domState.goToNextNode();
        const prev = domState.currentNode;
        domState.goToNextNode();
        expect(domState.previousNode).toBe(prev);
        expect(domState.currentNode?.getNode()).toBe(root.querySelector('#e1'));
    });

    it('handles empty tree gracefully', () => {
        const emptyRoot = document.createElement('div');
        const emptyDomState = new DomState(emptyRoot, transaction, config);
        emptyDomState.goToNextNode();
        expect(emptyDomState.completed).toBe(true);
    });
});
