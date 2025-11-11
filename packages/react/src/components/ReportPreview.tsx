import type { ReactNode } from 'react';
import { previewClassName } from '@paprize/core';

export function ReportPreview({ children }: { children: ReactNode }) {
    return <div className={previewClassName}>{children}</div>;
}
