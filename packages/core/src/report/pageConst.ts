import type { PageSize, PageMargin } from './pageTypes';

/**
 * Predefined values for commonly used {@link PageSize}
 * @privateRemarks
 * Type casting is only for cleaner TypeDoc output
 */
export const pageSize = {
    /** 841mm x 594mm */
    A1: { height: '841mm', width: '594mm' } as PageSize,
    /** 594mm x 420mm */
    A2: { height: '594mm', width: '420mm' } as PageSize,
    /** 420mm x 297mm */
    A3: { height: '420mm', width: '297mm' } as PageSize,
    /** 297mm x 210mm */
    A4: { height: '297mm', width: '210mm' } as PageSize,
    /** 210mm x 148mm */
    A5: { height: '210mm', width: '148mm' } as PageSize,
    /** 148mm x 105mm */
    A6: { height: '148mm', width: '105mm' } as PageSize,
    /** 500mm x 353mm */
    B3: { height: '500mm', width: '353mm' } as PageSize,
    /** 353mm x 250mm */
    B4: { height: '353mm', width: '250mm' } as PageSize,
    /** 250mm x 176mm */
    B5: { height: '250mm', width: '176mm' } as PageSize,
    /** 8.5in x 11in */
    Letter: { height: '8.5in', width: '11in' } as PageSize,
    /** 11in x 8.5in */
    Legal: { height: '11in', width: '8.5in' } as PageSize,
    /** 11in x 17in */
    Tabloid: { height: '11in', width: '17in' } as PageSize,
} as const satisfies Record<string, PageSize>;

/**
 * Predefined values for commonly used {@link PageMargin}
 * @privateRemarks
 * Type casting is only for cleaner TypeDoc output
 */
export const pageMargin = {
    /** Top, Right, Bottom, Left: 1in */
    Normal: {
        top: '1in',
        right: '1in',
        bottom: '1in',
        left: '1in',
    } as PageMargin,
    /** Top: 0.4in, Right, Bottom, Left: 0.6in */
    Narrow: {
        top: '0.4in',
        right: '0.6in',
        bottom: '0.6in',
        left: '0.6in',
    } as PageMargin,
    /** Top, Bottom: 0.5in, Right, Left: 2in */
    Wide: {
        top: '0.5in',
        right: '2in',
        bottom: '0.5in',
        left: '2in',
    } as PageMargin,
    /** Top, Right, Bottom, Left: 0 */
    None: {
        top: '0in',
        right: '0in',
        bottom: '0in',
        left: '0in',
    } as PageMargin,
} as const satisfies Record<string, PageMargin>;
