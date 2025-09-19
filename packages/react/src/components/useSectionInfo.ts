import { atom, useAtomValue } from 'jotai';
import { useContext, useMemo } from 'react';
import { sectionsAtom } from './store';
import { SectionContext } from './SectionContext';

/**
 * Represents information about a section, including pagination details and pending suspensions.
 */
export interface SectionInfo {
    /**
     * The total number of pages in the section.
     * When isPaginated is false, this value is 0.
     */
    totalPages: number;

    /**
     * Indicates whether the section is paginated.
     */
    isPaginated: boolean;

    /**
     * The number of pending suspensions in the section.
     */
    pendingSuspensions: number;
}

const defaultSectionInfo: SectionInfo = {
    totalPages: 0,
    isPaginated: false,
    pendingSuspensions: 0,
};

export const useSectionInfo = () => {
    const sectionId = useContext(SectionContext);
    const sectionAtom = useMemo(
        () =>
            atom((get): SectionInfo => {
                const state = get(sectionsAtom).get(sectionId);
                if (state) {
                    return {
                        totalPages: state.totalPages,
                        isPaginated: state.isPaginated,
                        pendingSuspensions: state.pendingSuspensions.size,
                    };
                }
                return defaultSectionInfo;
            }),
        [sectionId]
    );
    const value = useAtomValue(sectionAtom);

    return {
        sectionId: sectionId,
        totalPages: value.totalPages,
    };
};
