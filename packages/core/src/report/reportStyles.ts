import type * as CSS from 'csstype';
import {
    pageClassName,
    previewClassName,
    sectionClassName,
} from '../constants';
import type { PageSize, PageMargin } from './pageTypes';
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

    :root {
        --paprize-page-background-color: #ffffff;
        --paprize-page-box-shadow: rgb(142 138 138) -1px 3px 5px 2px;
        --paprize-section-margin-bottom: 10px;
        --paprize-preview-background-color: rgb(218 220 224);
        --paprize-preview-padding: 30px 10px;
    }

    body {
        margin: 0;
    }
    
    @media screen {
        .${previewClassName} {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: var(--paprize-preview-background-color);
            padding: var(--paprize-preview-padding);
        }

        .${pageClassName} {
            box-shadow: var(--paprize-page-box-shadow);
            background-color: var(--paprize-page-background-color);
        }

        .${sectionClassName} {
            margin-bottom: var(--paprize-section-margin-bottom);
        }
    }

    @media print {
        html:has(.${previewClassName}) *:not(.${previewClassName}):not(.${previewClassName} *):not(:has(.${previewClassName})) {
            display: none !important;
        }
    }   
 `;

export type CSSProperties = CSS.Properties<string | number>;

const component: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
};

const outOfScreen: CSSProperties = {
    position: 'absolute',
    left: '-9999px',
    top: '-9999px',
    visibility: 'hidden',
};

const page = (pageSize: PageSize, pageMargin: PageMargin): CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    width: pageSize.width,
    height: pageSize.height,
    maxHeight: pageSize.height,
    position: 'relative',
    padding: shorthand(pageMargin),
    zIndex: '1',
});

const pageContent: CSSProperties = {
    overflow: 'hidden',
    width: '100%',
    height: '100%',
};

const overlay: CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: 0,
    top: 0,
};

const section = (sectionId: string): CSSProperties => ({
    page: `section-${sectionId}`,
});

function sectionPageMedia(sectionId: string, size: PageSize): string {
    return `@page section-${sectionId} {
      margin: none; 
      size:${size.width} ${size.height}; 
      width:${size.width};
      height:${size.height};
    }`;
}

export const reportStyles = {
    globalStyle,
    component,
    outOfScreen,
    page,
    overlay,
    pageContent,
    sectionPageMedia,
    section,
};
