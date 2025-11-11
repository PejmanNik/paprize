import type { ReportBuilder } from '@paprize/core';
import { createContext, useContext } from 'react';

export const ReportBuilderContext = createContext<ReportBuilder | null>(null);

export function useReportBuilder() {
    const context = useContext(ReportBuilderContext);
    if (!context) {
        throw new Error(
            'ReportRoot is missing. Please wrap your component tree with ReportRoot component.'
        );
    }

    return context;
}
