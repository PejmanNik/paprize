import type { Page, PDFOptions } from 'puppeteer-core';
import { openReport } from './openReport';
import { pageToPdf } from './pageToPdf';

/**
 * Generates a PDF from a report by navigating to the specified report URL
 * and optionally sending JSON data to the page.
 *
 * @param page - The Puppeteer `Page` instance used to interact with the report.
 * @param reportUrl - The URL of the report to be converted to a PDF.
 * @param jsonData - Optional JSON data to be sent to the report page.
 * @param pdfOptions - Optional configuration for generating the PDF, including timeout and other settings.
 * @returns A promise that resolves to a `Uint8Array` containing the generated PDF data.
 */
export async function reportToPdf(
    page: Page,
    reportUrl: URL,
    jsonData?: string,
    pdfOptions?: PDFOptions
): Promise<Uint8Array> {
    await openReport(page, reportUrl, jsonData, pdfOptions?.timeout);
    return await pageToPdf(page, pdfOptions);
}
