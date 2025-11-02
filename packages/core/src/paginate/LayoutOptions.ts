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
     * If an element does not fit in the available space on the current page,
     * it will be moved entirely to the next page. If it still does not fit on an empty page,
     * it will be skipped and not rendered.
     * @defaultValue false
     */
    keepOnSamePage?: boolean;

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
