import type { SectionComponents } from '@paprize/core';

/**
 * {@inheritDoc @paprize/core!PageContext}
 */
export interface DomPageContext {
    /**
     * {@inheritDoc @paprize/core!PageContext.sectionId}
     */
    sectionId: string;
    /**
     * {@inheritDoc @paprize/core!PageContext.pageIndex}
     */
    pageIndex: number;
    /**
     * {@inheritDoc @paprize/core!PageContext.totalPages}
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
 * {@inheritDoc @paprize/core!SectionContext}
 */
export interface DomSectionContext {
    /**
     * {@inheritDoc @paprize/core!SectionContext.sectionIndex}
     */
    sectionIndex: number;
    /**
     * {@inheritDoc @paprize/core!SectionContext.sectionId}
     */
    sectionId: string;
    /**
     * {@inheritDoc @paprize/core!SectionContext.isSuspended}
     */
    isSuspended: boolean;
    /**
     * {@inheritDoc @paprize/core!SectionContext.isPaginated}
     */
    isPaginated: boolean;
    /**
     * {@inheritDoc @paprize/core!SectionContext.pages}
     */
    pages: DomPageContext[];
}

/**
 * {@inheritDoc @paprize/core!PaginationCycleCompleted}
 */
export interface DomPaginationCycleCompleted {
    /**
     * {@inheritDoc @paprize/core!PaginationCycleCompleted.sections}
     */
    sections: DomSectionContext[];
}

/**
 * {@inheritDoc @paprize/core!ReportBuilderEvents}
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
