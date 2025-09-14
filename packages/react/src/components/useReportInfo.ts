import { useAtomValue } from 'jotai';
import { reportAtom, sectionsAtom } from './store';
import { useMemo } from 'react';

/**
 * Represents information about a report, including its sections and pagination details.
 */
export interface ReportInfo {
    /**
     * The total number of sections in the report.
     * When isFirstPaginationCompleted is false, this value is 0.
     * When isPaginated is false, this value is not guaranteed to be accurate.
     */
    totalSections: number;

    /**
     * Indicates whether the report is ready and all sections are paginated.
     */
    isPaginated: boolean;

    /**
     * Indicates whether the first pagination process has been completed.
     * This becomes true once at least one section has been paginated.
     */
    isFirstPaginationCompleted: boolean;

    /**
     * An array of sections in the report, each containing details about the section.
     */
    sections: {
        /**
         * The name of the section.
         */
        sectionName: string;

        /**
         * The total number of pages in the section.
         */
        totalPages: number;

        /**
         * Indicates whether the section is paginated.
         */
        isPaginated: boolean;
    }[];
}

export function useReportInfo() {
    const sections = useAtomValue(sectionsAtom);
    const report = useAtomValue(reportAtom);

    return useMemo(
        (): ReportInfo => ({
            totalSections: report.totalSections,
            isPaginated: report.isPaginated,
            isFirstPaginationCompleted: report.totalSections > 0,
            sections: Array.from(sections.entries()).map(
                ([key, { totalPages, isPaginated }]) => ({
                    sectionName: key,
                    totalPages,
                    isPaginated,
                })
            ),
        }),
        [report.isPaginated, report.totalSections, sections]
    );
}
