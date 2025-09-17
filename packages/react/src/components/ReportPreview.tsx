import type { ReactNode } from 'react';
import { useStyle } from './useStyle';

const globalStyles = `
    :root {
        --paprize-page-background-color: #ffffff;
        --paprize-page-margin-bottom: 10px;
        --paprize-page-box-shadow: rgb(142 138 138) -1px 3px 5px 2px;
        --paprize-section-margin-bottom: 10px;
        --paprize-preview-background-color: rgb(218 220 224);
        --paprize-preview-padding: 30px 10px;
    }

    body {
        margin: 0;
    }

    @media screen {
        .paprize-preview {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: var(--paprize-preview-background-color);
            padding: var(--paprize-preview-padding);
        }

        .paprize-page {
            box-shadow: var(--paprize-page-box-shadow);
            margin-bottom: var(--paprize-page-margin-bottom);
            background-color: var(--paprize-page-background-color);
        }

        .paprize-section {
            margin-bottom: var(--paprize-section-margin-bottom);
        }
    }
`;

/**
 * ReportPreview is a wrapper component that applies styles to its children, mimicking the appearance of the Chrome Print Preview screen.
 * Use this component to render reports or documents with a print-friendly layout and consistent visual formatting in client side application.
 */
export function ReportPreview({ children }: { children: ReactNode }) {
    useStyle(globalStyles);
    return <div className="paprize-preview">{children}</div>;
}
