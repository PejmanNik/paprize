import type { PDFOptions } from 'puppeteer-core';

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
};

export type ReportOptions = Omit<PDFOptions, keyof typeof paprizeOptions>;
