import type {
    PaginationCycleCompleted,
    SectionContext,
} from '@paprize/core/src';

export interface SectionInfo {
    sectionId: string;
    sectionIndex: number;
    isPaginated: boolean;
    isSuspended: boolean;
    pages: PageInfo[];
}

export interface PageInfo {
    pageIndex: number;
    totalPages: number;
}

export interface ReportInfo {
    sections: SectionInfo[];
}

export function pageContextToPageInfo(pc: {
    index: number;
    totalPages: number;
}): PageInfo {
    return {
        pageIndex: pc.index,
        totalPages: pc.totalPages,
    };
}

export function sectionContextToSectionInfo(sc: SectionContext): SectionInfo {
    return {
        sectionId: sc.sectionId,
        sectionIndex: sc.index,
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
