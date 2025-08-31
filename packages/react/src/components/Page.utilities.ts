import { getVisibleHeight } from '@paprize/core/src';
import type { PageMargin } from './pageTypes';

export function shorthand(margin?: PageMargin) {
    return margin
        ? `${margin.top} ${margin.right} ${margin.bottom} ${margin.left}`
        : '0';
}

export function getVisibleSize(element: Element) {
    const rect = element.getBoundingClientRect();
    const computedStyle = getComputedStyle(element);

    const marginLeft = parseFloat(computedStyle.marginLeft) || 0;
    const marginRight = parseFloat(computedStyle.marginRight) || 0;

    return {
        height: getVisibleHeight(element),
        width: rect.width + marginLeft + marginRight,
    };
}
