import {
  currentElementClassName,
  currentTextClassName,
  ignoredElementClassName,
  ignoredTextClassName,
} from "../constants";
import { isInHighlightMode } from "./debugMode";
import { PageNodeType, type PageNode } from "../paginate/PageNodes";

export function markNode(
  node: PageNode | undefined | null,
  elementClsName: string,
  textClsName: string
) {
  if (node && node.type == PageNodeType.Element) {
    node.getNode().classList.add(elementClsName);
  } else if (node && node.type == PageNodeType.Text) {
    node.getNode().parentElement?.classList.add(textClsName);
  }
}

export function unmarkNode(
  node: PageNode | undefined | null,
  elementClsName: string,
  textClsName: string
) {
  if (node && node.type == PageNodeType.Element) {
    node.getNode().classList.remove(elementClsName);
  } else if (node && node.type == PageNodeType.Text) {
    node.getNode().parentElement?.classList.remove(textClsName);
  }
}

export function markIgnoredNode(node: PageNode | undefined | null) {
  if (!isInHighlightMode()) {
    return;
  }
  if (node && node.type == PageNodeType.Element) {
    node.getNode().classList.add(ignoredElementClassName);
  } else if (node && node.type == PageNodeType.Text) {
    node.getNode().parentElement?.classList.add(ignoredTextClassName);
  }
}

export function markCurrentNode(node: PageNode | undefined | null) {
  if (!isInHighlightMode()) {
    return;
  }
  if (node && node.type == PageNodeType.Element) {
    node.getNode().classList.add(currentElementClassName);
  } else if (node && node.type == PageNodeType.Text) {
    node.getNode().parentElement?.classList.add(currentTextClassName);
  }
}

export function unmarkCurrentNode(node: PageNode | undefined | null) {
  if (!isInHighlightMode()) {
    return;
  }
  if (node && node.type == PageNodeType.Element) {
    node.getNode().classList.remove(currentElementClassName);
  } else if (node && node.type == PageNodeType.Text) {
    node.getNode().parentElement?.classList.remove(currentTextClassName);
  }
}
