import { useEffect, useRef, type ReactNode } from 'react';
import { useReportBuilder } from '../internal/useReportBuilder';

export function PageContent({ children }: { children: ReactNode }) {
    const reportBuilder = useReportBuilder();
    const isFirstCycleCompleted = useRef(false);

    useEffect(() => {
        const unsubscribe = reportBuilder.monitor.addEventListener(
            'paginationCycleCompleted',
            () => {
                isFirstCycleCompleted.current = true;
            }
        );

        return () => unsubscribe();
    }, [reportBuilder.monitor]);

    // If the children change after the first pagination cycle, we need to re-paginate
    // this can happen if the content is dynamic or loaded asynchronously
    // if we don't do this, the new content will be ignored in the pagination
    useEffect(() => {
        if (isFirstCycleCompleted.current) {
            reportBuilder.schedulePagination();
        }
    }, [children, reportBuilder]);

    return <>{children}</>;
}
