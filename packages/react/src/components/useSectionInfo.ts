import { atom, useAtomValue } from 'jotai';
import { useContext, useMemo } from 'react';
import { reportInfoAtom, type SectionInfo } from './reportInfo';
import { SectionContext } from './SectionContext';

export const useSectionInfo = () => {
    const sectionName = useContext(SectionContext);
    const sectionAtom = useMemo(
        () =>
            atom(
                (get) =>
                    get(reportInfoAtom).get(sectionName) ??
                    ({ totalPages: 0 } as SectionInfo)
            ),
        [sectionName]
    );
    const value = useAtomValue(sectionAtom);

    return {
        name: sectionName,
        ...value,
    };
};
