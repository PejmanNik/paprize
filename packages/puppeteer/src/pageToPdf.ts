import type { Page, PDFOptions } from 'puppeteer-core';

/**
 * Generates a PDF from the given Puppeteer `Page` instance using the specified options.
 *
 * @param page - The Puppeteer `Page` instance to generate the PDF from.
 * @param pdfOptions - Optional additional options to customize the PDF generation. These options
 * will be merged with the default settings.
 * @returns A promise that resolves to a `Uint8Array` containing the generated PDF data.
 */
export function pageToPdf(
    page: Page,
    pdfOptions?: PDFOptions
): Promise<Uint8Array> {
    return page.pdf({
        printBackground: true,
        displayHeaderFooter: false,
        preferCSSPageSize: true,
        margin: {
            bottom: '0px',
            left: '0px',
            right: '0px',
            top: '0px',
        },
        ...pdfOptions,
    });
}
