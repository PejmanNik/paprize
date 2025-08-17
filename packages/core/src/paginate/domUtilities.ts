export function isElement(node: Node): node is Element {
  return node.nodeType === Node.ELEMENT_NODE;
}

export function isTextNode(node: Node): node is Text {
  return node.nodeType === Node.TEXT_NODE;
}

export function getTotalHeight(element: Element): number {
  const rect = element.getBoundingClientRect();
  const computedStyle = getComputedStyle(element);

  const marginTop = parseFloat(computedStyle.marginTop) || 0;
  const marginBottom = parseFloat(computedStyle.marginBottom) || 0;

  return rect.height + marginTop + marginBottom;
}