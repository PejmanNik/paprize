import { DomState } from "./DomState";
import { PageManager } from "./PageManager";
import type { PageSize } from "./PageSize";
import { PageNodeType } from "./PageNodes";
import { paginateElementAcrossPages } from "./paginateElement";
import { paginateTextByWord } from "./paginateText";
import { SplitResult } from "./SplitResult";
import { Transaction } from "./Transaction";
import logger from "loglevel";
import { defaultConfig, type PaginationConfig } from "./PaginationConfig";
import { markIgnoredNode } from "../utilities/pageNodeMarker";

const logPrefix = "\x1b[103mPAGINATOR\x1b[0m";

export class Paginator {
  private _domState: DomState;
  private _pageManager: PageManager;
  private _transaction: Transaction;
  private _tempBook: Element;

  constructor(root: Element, pageSize: PageSize, config?: PaginationConfig) {
    this._tempBook = document.createElement("div");
    document.body.appendChild(this._tempBook);

    this._transaction = new Transaction();
    this._domState = new DomState(
      root,
      this._transaction,
      config ?? defaultConfig
    );
    this._pageManager = new PageManager(
      this._tempBook,
      pageSize,
      this._transaction,
      config ?? defaultConfig
    );
  }

  public paginate(): {
    hasPage: boolean;
    firstPage: ChildNode;
    dispose: () => void;
  } {
    this.processAllNodes();

    return {
      hasPage: this._tempBook.firstChild !== null,
      firstPage: this._tempBook.firstChild!,
      dispose: () => {
        this._tempBook.remove();
      },
    };
  }

  private processAllNodes(): void {
    this._domState.nextNode();

    do {
      logger.info(logPrefix, "paginating node", this._domState.currentNode);
      const result = this.processCurrentNode();
      switch (result) {
        case SplitResult.None:
          this.handleNodeSkipped();
          break;

        case SplitResult.FullNodePlaced:
          this.handleFullNodePlaced();
          break;

        case SplitResult.SplitChildren:
          this.handleChildrenSplit();
          break;
      }
    } while (!this._domState.completed);

    logger.info(logPrefix, "pagination completed");
  }

  private handleNodeSkipped(): void {
    logger.info(logPrefix, "node skipped - couldn't paginate");

    markIgnoredNode(this._domState.currentNode);
    this._domState.nextNode();
  }

  private handleFullNodePlaced(): void {
    logger.info(logPrefix, "node fully paginated");

    const { parentsTraversed } = this._domState.nextSiblingOrParentSibling();
    for (let i = 0; i < parentsTraversed; i++) {
      this._pageManager.leaveElement();
    }
  }

  private handleChildrenSplit(): void {
    logger.info(logPrefix, "node partially paginated - splitting children");

    if (
      this._domState.firstChildOrNextNode().parentsTraversed === 1 &&
      this._domState.previousNode?.type === PageNodeType.Element
    ) {
      this._pageManager.enterElement();
    }
  }

  private processCurrentNode(): SplitResult {
    if (!this._domState.currentNode) {
      return SplitResult.None;
    }

    if (this._domState.currentNode.type === PageNodeType.Element) {
      return paginateElementAcrossPages(
        this._domState.currentNode,
        this._pageManager
      );
    } else {
      return paginateTextByWord(this._domState.currentNode, this._pageManager);
    }
  }
}
