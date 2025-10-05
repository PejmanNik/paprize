import type { PageDimension, PageMargin } from './pageTypes';
import { shorthand } from './utils';

export const globalStyle = `
    html {
        box-sizing: border-box;
    }

    *,
    *:before,
    *:after {
        box-sizing: inherit;
    }
    `;

const component: Partial<CSSStyleDeclaration> = {
    display: 'block',
    flexDirection: 'column',
};

const outOfScreen: Partial<CSSStyleDeclaration> = {
    position: 'absolute',
    left: '-9999px',
    top: '-9999px',
    visibility: 'hidden',
};

const page = (
    pageDimension: PageDimension,
    pageMargin: PageMargin
): Partial<CSSStyleDeclaration> => ({
    display: 'flex',
    flexDirection: 'column',
    width: pageDimension.width,
    height: pageDimension.height,
    maxHeight: pageDimension.height,
    position: 'relative',
    padding: shorthand(pageMargin),
    zIndex: '1',
});

const pageContent: Partial<CSSStyleDeclaration> = {
    overflow: 'hidden',
    width: '100%',
    height: '100%',
};

export const reportStyles = {
    globalStyle,
    component,
    outOfScreen,
    page,
    pageContent,
};
