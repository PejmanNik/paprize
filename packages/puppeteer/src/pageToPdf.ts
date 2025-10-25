import type { Page } from 'puppeteer-core';
import { paprizeOptions, type ReportOptions } from './options';

/**
 * Generates a PDF from the given Puppeteer `Page` instance using the specified options.
 *
 * @param page - The Puppeteer `Page` instance to generate the PDF from.
 * @param options - Optional additional options to customize the PDF generation. These options
 * will be merged with the default settings.
 * @returns A promise that resolves to a `Uint8Array` containing the generated PDF data.
 */
export function pageToPdf(
    page: Page,
    options?: ReportOptions
): Promise<Uint8Array> {
    return page.pdf({
        ...paprizeOptions,
        ...options,
    });
}
