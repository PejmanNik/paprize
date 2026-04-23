/**
 * Controls how elements handle page breaks when they exceed the remaining space on a page.
 * - `true` (**Strict Keep**): Forces the element to stay whole. Moves it to the next page
 * if it doesn't fit. If it's larger than a full empty page, it is dropped.
 * - `false` (**Allow Split**): Prioritizes rendering immediately. Splits the element across
 * pages; if splitting is impossible, it moves to the next page or is dropped.
 * - `'prefer'` (**Balanced**): Attempts to keep the element whole by moving it to the next
 * page first. If it still doesn't fit a full page, it falls back to splitting.
 */
export type KeepOnSamePageOptions = true | false | 'prefer';

/**
 * Layout options for the pagination engine
 */
export interface LayoutOptions {
    /**
     * Specifies the character used for hyphenation when a word is broken across lines.
     * @defaultValue "-"
     */
    hyphen?: string;

    /**
     * Prevents an element from being split across pages.
     * @defaultValue false
     */
    keepOnSamePage?: KeepOnSamePageOptions;

    /**
     * Disables automatic word hyphenation.
     * When disabled, if a word (a sequence of text without whitespace) does not fit
     * on the current page, it will move to the next page instead of being split
     * with a hyphen character.
     * @defaultValue false
     */
    hyphenationDisabled?: boolean;
}

export const defaultLayoutOptions: Required<LayoutOptions> = {
    hyphen: '-',
    keepOnSamePage: false,
    hyphenationDisabled: false,
};
