/**
 * Context information for a paginated page.
 */
export interface PageContext {
    /**
     * Index of the section to which this page belongs
     */
    sectionId: string;
    /**
     * Index of this page within its section.
     */
    pageIndex: number;
    /**
     * Total number of pages in the section that contains this page.
     */
    totalPages: number;
    /**
     * HTML string representing the paginated content of this page.
     */
    pageContentHtml: string;
}

export interface SectionContext {
    sectionIndex: number;
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
