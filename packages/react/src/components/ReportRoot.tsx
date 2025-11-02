import { useEffect, useMemo, type ReactNode } from 'react';
import { ReportBuilder } from '@paprize/core/src';
import { ReportBuilderContext } from '../internal/useReportBuilder';

export interface ReportRootProps {
    children: ReactNode;
}

export function ReportRoot({ children }: ReportRootProps) {
    const reportBuilder = useMemo(() => new ReportBuilder(), []);

    useEffect(() => {
        reportBuilder.schedulePagination();
    }, [reportBuilder]);

    return (
        <ReportBuilderContext value={reportBuilder}>
            {children}
        </ReportBuilderContext>
    );
}
