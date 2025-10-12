import { useRef, useSyncExternalStore } from 'react';
import { useReportBuilder } from '../internal/useReportBuilder';
import type { PaginationCycleCompleted } from '@paprize/core/src';
import { paginationCycleToReportInfo, type ReportInfo } from '../internal/eventHelper';

export function useReportInfo(): ReportInfo {
    const reportBuilder = useReportBuilder();
    const stateRef = useRef<PaginationCycleCompleted>({
        sections: []
    });

    const state = useSyncExternalStore((callback) => {
        return reportBuilder.monitor.addEventListener('paginationCycleCompleted', (pg) => {
            stateRef.current = pg;
            callback();
        });
    }, () => stateRef.current);

    return paginationCycleToReportInfo(state);
}
