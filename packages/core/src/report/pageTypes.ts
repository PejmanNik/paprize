/**
 * Represents the dimensions of a page.
 * All values should be valid CSS size strings (e.g., '210mm', '8.5in').
 *
 * Common presets are available in  {@link pageSize}
 */
export interface PageSize {
    /** @public */
    height: string;
    /** @public */
    width: string;
}

/**
 * Represents the margin sizes for a page.
 * All values should be valid CSS size strings (e.g., '10mm', '1in').
 *
 * Common presets are available in {@link pageMargin}
 */
export interface PageMargin {
    /** @public */
    top: string;
    /** @public */
    right: string;
    /** @public */
    bottom: string;
    /** @public */
    left: string;
}

/**
 * Describes the page orientation.
 *
 * - 'portrait' (default): the page is taller than it is wide. Use the provided
 *   width and height as-is.
 * - 'landscape': the page is wider than it is tall. When applying landscape,
 *   swap the width and height.
 */
export type PageOrientation = 'portrait' | 'landscape';
