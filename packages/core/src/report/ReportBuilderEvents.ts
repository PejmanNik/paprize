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

/**
 * Context information for a paginated section.
 */
export interface SectionContext {
    /**
     * Index of the section within the report.
     */
    sectionIndex: number;
    /**
     * Unique identifier of the section.
     */
    sectionId: string;
    /**
     * Indicates whether pagination for this section is suspended
     * and waiting for the suspension to be resolved.
     */
    isSuspended: boolean;
    /**
     * Indicates whether pagination for this section has completed.
     */
    isPaginated: boolean;
    /**
     * All paginated pages that belong to this section.
     */
    pages: PageContext[];
}

/**
 * Context information for pagination cycle.
 */
export interface PaginationCycleCompleted {
    /**
     * All paginated section within the report.
     */
    sections: SectionContext[];
}

/**
 * Available events that can be subscribed to, during the pagination process.
 */
export interface ReportBuilderEvents {
    /**
     * Triggered when a page has been fully paginated.
     * event: {@link PageContext}
     */
    pageCompleted: (event: PageContext) => void;
    /**
     * Triggered when a section has been fully paginated.
     * event: {@link SectionContext}
     */
    sectionCompleted: (event: SectionContext) => void;
    /**
     * Triggered when a new section is created.
     * event: {@link SectionContext}
     */
    sectionCreated: (event: SectionContext) => void;
    /**
     * Triggered when an entire pagination cycle is completed.
     * event: {@link PaginationCycleCompleted}
     */
    paginationCycleCompleted: (event: PaginationCycleCompleted) => void;
}
