import type { PaginationCycleCompleted, SectionContext } from '@paprize/core';

/**
 * {@inheritDoc @paprize/core!PageContext}
 */
export interface PageInfo {
    /**
     * {@inheritDoc @paprize/core!PageContext.pageIndex}
     */
    pageIndex: number;
    /**
     * {@inheritDoc @paprize/core!PageContext.totalPages}
     */
    totalPages: number;
}

/**
 * {@inheritDoc @paprize/core!SectionContext}
 */
export interface SectionInfo {
    /**
     * {@inheritDoc @paprize/core!SectionContext.sectionId}
     */
    sectionId: string;
    /**
     * {@inheritDoc @paprize/core!SectionContext.sectionIndex}
     */
    sectionIndex: number;
    /**
     * {@inheritDoc @paprize/core!SectionContext.isPaginated}
     */
    isPaginated: boolean;
    /**
     * {@inheritDoc @paprize/core!SectionContext.isSuspended}
     */
    isSuspended: boolean;
    /**
     * {@inheritDoc @paprize/core!SectionContext.pages}
     */
    pages: PageInfo[];
}

/**
 * {@inheritDoc @paprize/core!PaginationCycleCompleted}
 */

export interface ReportInfo {
    /**
     * {@inheritDoc @paprize/core!PaginationCycleCompleted.sections}
     */
    sections: SectionInfo[];
}

export function pageContextToPageInfo(pc: {
    pageIndex: number;
    totalPages: number;
}): PageInfo {
    return {
        pageIndex: pc.pageIndex,
        totalPages: pc.totalPages,
    };
}

export function sectionContextToSectionInfo(sc: SectionContext): SectionInfo {
    return {
        sectionId: sc.sectionId,
        sectionIndex: sc.sectionIndex,
        isPaginated: sc.isPaginated,
        isSuspended: sc.isSuspended,
        pages: sc.pages.map(pageContextToPageInfo),
    };
}

export function paginationCycleToReportInfo(
    rc: PaginationCycleCompleted
): ReportInfo {
    return {
        sections: rc.sections.map(sectionContextToSectionInfo),
    };
}
