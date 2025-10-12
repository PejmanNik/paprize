import { useContext, useRef, useSyncExternalStore } from 'react';
import type { SectionContext } from '@paprize/core/src';
import { useReportBuilder } from '../internal/useReportBuilder';
import { SectionIdContext } from '../internal/SectionIdContext';
import type { SectionInfo } from '../internal/eventHelper';

export const useSectionInfo = (): SectionInfo => {
    const sectionId = useContext(SectionIdContext);
    const reportBuilder = useReportBuilder();
    const stateRef = useRef<SectionContext>({
        pages: [],
        isPaginated: false,
        isSuspended: false,
        index: -1,
        sectionId: sectionId,
    });

    const state = useSyncExternalStore((callback) => {
        return reportBuilder.monitor.addEventListener('sectionCompleted', (sc) => {
            if (sc.sectionId !== sectionId) return;
            stateRef.current = sc;
            callback();
        });
    }, () => stateRef.current);

    return {
        sectionId: sectionId,
        sectionIndex: state.index,
        isSuspended: state.isSuspended,
        isPaginated: state.isPaginated,
        pages: state.pages.map((p) => ({
            pageIndex: p.index,
            totalPages: p.totalPages,
        })),
    };
};
