import type * as Core from '@paprize/core/src';

export interface DomPageContext extends Core.SectionComponents {
    sectionId: string;
    index: number;
    totalPages: number;
    page: HTMLElement;
}

export interface DomSectionContext {
    index: number;
    sectionId: string;
    isSuspended: boolean;
    pages: DomPageContext[];
}

export interface DomPaginationCycleCompleted {
    sections: DomSectionContext[];
}

export interface PaprizeReportEvents {
    pageCompleted: (event: DomPageContext) => void;
    sectionCompleted: (event: DomSectionContext) => void;
    sectionCreated: (event: DomSectionContext) => void;
    paginationCycleCompleted: (event: DomPaginationCycleCompleted) => void;
}
