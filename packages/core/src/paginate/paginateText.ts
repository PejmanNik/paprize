import logger from '../logger';
import type { PageManager } from './PageManager';
import type { PageText } from './PageNodes';
import { SplitResult } from './SplitResult';
import type { PaginationConfig } from './PaginationConfig';

/**
 * Splits text across pages by whole words; falls back to character splitting
 * only when a single word cannot fit on an empty page.
 *
 * Algorithm:
 * 1. Tokenize into words + whitespace (preserve spacing).
 * 2. Try appending each token to the current text node.
 * 3. On overflow: revert, try the whole token at top of a new page inside a transaction.
 * 4. If it still overflows on an empty page, rollback and split by character
 *    starting in the current (previous) page
 */
export function paginateTextByWord(
    text: PageText,
    pageManager: PageManager
): SplitResult {
    let splitResult: SplitResult = SplitResult.FullNodePlaced;

    const tokens = text.textContent
        .split(/(\s+)/)
        .filter((token) => token !== '');

    let pendingToken: string | undefined;
    let tokenIndex = 0;

    while (pendingToken || tokenIndex < tokens.length) {
        const currentToken = pendingToken ?? tokens[tokenIndex];
        const result = processToken(currentToken, pageManager, text.config);

        if (!result.completed) {
            splitResult = SplitResult.None;
        }

        if (result.pendingToken) {
            pendingToken = result.pendingToken;
        } else {
            pendingToken = undefined;
            tokenIndex++;
        }
    }

    return splitResult;
}

function processToken(
    token: string,
    pageManager: PageManager,
    config: PaginationConfig
): {
    completed: boolean;
    pendingToken?: string;
} {
    if (!pageManager.hasEmptySpace()) {
        pageManager.nextPage();
    }
    let textNode = pageManager.addTextNode('');

    // tentatively append
    const originalContent = textNode.textContent;
    textNode.textContent += token;

    if (!pageManager.isOverFlow()) {
        // token fits on new page
        return {
            completed: true,
        };
    }

    // overflow: revert append
    textNode.textContent = originalContent;

    const overflowResult = handleTokenOverflow(token, pageManager, config);
    return {
        pendingToken: overflowResult.leftovers,
        completed: overflowResult.completed,
    };
}

function handleTokenOverflow(
    token: string,
    pageManager: PageManager,
    config: PaginationConfig
): {
    completed: boolean;
    leftovers?: string;
} {
    // try on a fresh page within a transaction
    const { rollback, commit } = pageManager.startTransaction();
    pageManager.nextPage();
    pageManager.addTextNode(token);

    if (!pageManager.isOverFlow()) {
        // token fits entirely on the new page
        commit();

        return {
            completed: true,
        };
    }

    // still doesn't fit - rollback to previous state split the token by character (hyphenation)
    rollback();

    if (!config.hyphenationEnabled) {
        // If hyphenation is not enabled and the token is too long, we need to skip the token

        logger.warn('Hyphenation disabled, skipping oversized token:', token);

        return {
            completed: false,
        };
    }

    const leftovers = hyphenation(token, config.hyphen, pageManager);
    return {
        completed: true,
        leftovers: leftovers && leftovers.length > 0 ? leftovers : undefined,
    };
}

export function hyphenation(
    word: string,
    hyphen: string,
    pageManager: PageManager
): string | null {
    const textNode = pageManager.addTextNode('');
    let appended = '';

    for (let i = 0; i < word.length; i++) {
        const char = word[i];

        // tentatively add the character with hyphen
        const tentative = appended + char;
        textNode.textContent = tentative + hyphen;

        if (!pageManager.hasEmptySpace()) {
            // overflow: revert to previous appended
            textNode.textContent = appended ? appended + hyphen : '';

            pageManager.markPageAsFull();

            // return leftover starting from the char that did not fit
            return word.slice(i);
        }

        appended = tentative;
    }

    // all characters consumed; no leftovers
    return null;
}
