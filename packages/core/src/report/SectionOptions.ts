import type { PaginationOptions } from '../paginate/PaginationOptions';
import type { PageSize, PageOrientation, PageMargin } from './pageTypes';

/**
 * Configuration options for a section.
 * @inlineType PaginationConfig
 */

export interface SectionOptions extends Partial<Omit<PaginationOptions, 'id'>> {
    /**
     * Unique id of the section within the report.
     */
    readonly id: string;
    /**
     * Page size used for this section.
     */
    readonly size: PageSize;
    /**
     * Page orientation used for this section.
     * @inlineType PageOrientation
     * @default portrait
     */
    readonly orientation?: PageOrientation;
    /**
     * Page margins for this section.
     */
    readonly margin?: PageMargin;
    /**
     * A list of promises that must be resolved before the section can be paginated.
     */
    readonly suspense?: Promise<unknown>[];
}
