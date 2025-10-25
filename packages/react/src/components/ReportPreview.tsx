import type { ReactNode } from 'react';
import { previewClassName } from '@paprize/core/src';

/**
 * ReportPreview is a wrapper component that applies styles to its children, mimicking the appearance of the Chrome Print Preview screen.
 * Use this component to render reports or documents with a print-friendly layout and consistent visual formatting in client side application.
 */
export function ReportPreview({ children }: { children: ReactNode }) {
    return <div className={previewClassName}>{children}</div>;
}
