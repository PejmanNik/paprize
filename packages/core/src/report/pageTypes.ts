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
 * Defines the physical orientation of the page.
 * - `portrait`: Standard vertical orientation (height > width).
 * Dimensions are applied exactly as defined. **Default.**
 * - `landscape`: Horizontal orientation (width > height).
 * The provided width and height values are automatically swapped.
 */
export type PageOrientation = 'portrait' | 'landscape';
