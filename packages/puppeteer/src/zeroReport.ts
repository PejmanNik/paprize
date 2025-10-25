import {
    attributePrefix,
    pageMargin,
    pageSize,
    type PageDimension,
    type PageMargin,
} from '@paprize/core/src';
import { PaprizeReport, sectionAttribute } from '@paprize/vanilla/src';

export const sectionPageSizeAttribute = `${attributePrefix}section-page-size`;
export const sectionPageMarginAttribute = `${attributePrefix}section-page-margin`;

function parsePageSizeAttribute(section: Element): PageDimension {
    const size = section.getAttribute(sectionPageSizeAttribute);
    console.warn(
        'ss',
        size,
        section.getAttributeNames().join(','),
        sectionPageSizeAttribute,
        section.getAttribute('data-pz-section-page-size')
    );
    const dimension = Object.entries(pageSize).find(
        ([key]) => key.toLowerCase() === size?.toLowerCase()
    )?.[1];

    return dimension ?? pageSize.A4;
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

document.querySelectorAll(`[${sectionAttribute}]`).forEach((el) => {
    const id = el.id || `section-${sectionId++}`;
    if (!el.id) {
        el.id = id;
    }

    report.addSection({
        dimension: parsePageSizeAttribute(el),
        margin: parsePageMarginAttribute(el),
        id,
    });
});

report.schedulePaginate();
