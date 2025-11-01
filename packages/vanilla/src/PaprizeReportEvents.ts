import type { SectionComponents } from '@paprize/core/src';

/**
 * Context information for a paginated page.
 */
export interface DomPageContext {
    /**
     * Id of the section to which this page belongs
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
     * The root HTMLElement for this paginated page in the DOM.
     */
    page: HTMLElement;
    /**
     * Collection of HTMLElement components present on this page.
     */
    components: SectionComponents;
}

/**
 * Context information for a paginated section.
 */
export interface DomSectionContext {
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
     * All paginated pages that belong to this section.
     */
    pages: DomPageContext[];
}

/**
 * Context information for pagination cycle.
 */
export interface DomPaginationCycleCompleted {
    /**
     * All paginated section within the report.
     */
    sections: DomSectionContext[];
}

/**
 * Available events that can be subscribed to, during the pagination process.
 */
export interface PaprizeReportEvents {
    /**
     * Triggered when a page has been fully paginated.
     * event: {@link DomPageContext}
     */
    pageCompleted: (event: DomPageContext) => void;
    /**
     * Triggered when a section has been fully paginated.
     * event: {@link DomSectionContext}
     */
    sectionCompleted: (event: DomSectionContext) => void;
    /**
     * Triggered when a new section is created.
     * event: {@link DomSectionContext}
     */
    sectionCreated: (event: DomSectionContext) => void;
    /**
     * Triggered when an entire pagination cycle is completed.
     * event: {@link DomPaginationCycleCompleted}
     */
    paginationCycleCompleted: (event: DomPaginationCycleCompleted) => void;
}
