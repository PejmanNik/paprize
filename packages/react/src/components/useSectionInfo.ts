import { useContext, useRef, useSyncExternalStore } from 'react';
import type { SectionContext } from '@paprize/core';
import { useReportBuilder } from '../internal/useReportBuilder';
import { SectionIdContext } from '../internal/SectionIdContext';
import type { SectionInfo } from '../internal/eventHelper';

/**
 * React hook that returns information about the current section.
 */
export const useSectionInfo = (): SectionInfo => {
    const sectionId = useContext(SectionIdContext);
    const reportBuilder = useReportBuilder();
    const stateRef = useRef<Omit<SectionContext, 'options' | 'components'>>({
        pages: [],
        isPaginated: false,
        isSuspended: false,
        sectionIndex: -1,
        sectionId: sectionId,
    });

    const state = useSyncExternalStore(
        (callback) => {
            return reportBuilder.monitor.addEventListener(
                'sectionCompleted',
                (sc) => {
                    if (sc.sectionId !== sectionId) return;
                    stateRef.current = sc;
                    callback();
                }
            );
        },
        () => stateRef.current
    );

    return {
        sectionId: sectionId,
        sectionIndex: state.sectionIndex,
        isSuspended: state.isSuspended,
        isPaginated: state.isPaginated,
        pages: state.pages.map((p) => ({
            pageIndex: p.pageIndex,
            totalPages: p.totalPages,
        })),
    };
};
