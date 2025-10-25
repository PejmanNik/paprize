export interface PageContext {
    sectionId: string;
    index: number;
    totalPages: number;
    pageContentHtml: string;
}

export interface SectionContext {
    index: number;
    sectionId: string;
    isSuspended: boolean;
    isPaginated: boolean;
    pages: PageContext[];
}

export interface PaginationCycleCompleted {
    sections: SectionContext[];
}

export interface ReportBuilderEvents {
    pageCompleted: (event: PageContext) => void;
    sectionCompleted: (event: SectionContext) => void;
    sectionCreated: (event: SectionContext) => void;
    paginationCycleCompleted: (event: PaginationCycleCompleted) => void;
}
