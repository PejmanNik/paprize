import {
    pageMargin,
    pageSize,
    type PageSize,
    type PageMargin,
    type PageOrientation,
    attributePrefix,
} from '@paprize/core';
import { PaprizeReport, sectionAttribute } from '@paprize/vanilla';

export const sectionPageSizeAttribute = `${attributePrefix}section-page-size`;
export const sectionPageWidthAttribute = `${attributePrefix}section-page-width`;
export const sectionPageHeightAttribute = `${attributePrefix}section-page-height`;
export const sectionPageOrientationAttribute = `${attributePrefix}section-page-orientation`;
export const sectionPageMarginAttribute = `${attributePrefix}section-page-margin`;

function parsePageSizeAttribute(section: Element): PageSize {
    const sizeAttributeValue = section.getAttribute(sectionPageSizeAttribute);
    const widthAttributeValue = section.getAttribute(sectionPageWidthAttribute);
    const heightAttributeValue = section.getAttribute(
        sectionPageHeightAttribute
    );

    if (widthAttributeValue && heightAttributeValue) {
        return {
            width: widthAttributeValue,
            height: heightAttributeValue,
        };
    }

    const size = Object.entries(pageSize).find(
        ([key]) => key.toLowerCase() === sizeAttributeValue?.toLowerCase()
    )?.[1];

    return size ?? pageSize.A4;
}

function parsePageOrientation(section: Element): PageOrientation | undefined {
    const orientationAttributeValue = section
        .getAttribute(sectionPageOrientationAttribute)
        ?.toLocaleLowerCase();

    if (
        orientationAttributeValue === 'landscape' ||
        orientationAttributeValue === 'portrait'
    ) {
        return orientationAttributeValue;
    }

    return undefined;
}

function parsePageMarginAttribute(section: Element): PageMargin {
    const size = section.getAttribute(sectionPageMarginAttribute);
    const margin = Object.entries(pageMargin).find(
        ([key]) => key.toLowerCase() === size?.toLowerCase()
    )?.[1];

    return margin ?? pageMargin.Narrow;
}

export async function runZeroReport() {
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
            orientation: parsePageOrientation(el),
            margin: parsePageMarginAttribute(el),
            id,
        });
    }

    await report.schedulePagination();
}

window.runZeroReport = runZeroReport;
