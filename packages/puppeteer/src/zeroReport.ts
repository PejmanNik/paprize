import {
    attributePrefix,
    pageMargin,
    pageSize,
    type PageSize,
    type PageMargin,
} from '@paprize/core/src';
import { PaprizeReport, sectionAttribute } from '@paprize/vanilla/src';

export const sectionPageSizeAttribute = `${attributePrefix}section-page-size`;
export const sectionPageMarginAttribute = `${attributePrefix}section-page-margin`;

function parsePageSizeAttribute(section: Element): PageSize {
    const sizeAttributeValue = section.getAttribute(sectionPageSizeAttribute);
    const size = Object.entries(pageSize).find(
        ([key]) => key.toLowerCase() === sizeAttributeValue?.toLowerCase()
    )?.[1];

    return size ?? pageSize.A4;
}

function parsePageMarginAttribute(section: Element): PageMargin {
    const size = section.getAttribute(sectionPageMarginAttribute);
    const margin = Object.entries(pageMargin).find(
        ([key]) => key.toLowerCase() === size?.toLowerCase()
    )?.[1];

    return margin ?? pageMargin.Narrow;
}

let sectionId = 1;
const report = new PaprizeReport();

const elements = document.querySelectorAll(`[${sectionAttribute}]`);

for (const el of elements) {
    const id = el.id || `section-${sectionId++}`;
    if (!el.id) {
        el.id = id;
    }

    await report.addSection({
        size: parsePageSizeAttribute(el),
        margin: parsePageMarginAttribute(el),
        id,
    });
}

await report.schedulePagination();
