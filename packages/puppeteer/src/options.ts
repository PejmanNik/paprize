import type { PDFOptions } from 'puppeteer-core';

/**
 * Predefined static Paprize PDF options.
 *
 * including:
 * - waitForFonts: true
 * - printBackground: true
 * - displayHeaderFooter: false
 * - preferCSSPageSize: true
 * - margin: all sides 0px
 */
export const paprizeOptions: PDFOptions = {
    waitForFonts: true,
    printBackground: true,
    displayHeaderFooter: false,
    headerTemplate: undefined,
    footerTemplate: undefined,
    preferCSSPageSize: true,
    margin: {
        bottom: '0px',
        left: '0px',
        right: '0px',
        top: '0px',
    },
} as const;

/**
 * Options for generating a PDF report with Paprize.
 * extends Puppeteer's [PDFOptions](https://pptr.dev/api/puppeteer.pdfoptions)
 * , excluding options that are already set by Paprize {@link paprizeOptions}
 */
export type ReportOptions = Omit<PDFOptions, keyof typeof paprizeOptions>;
