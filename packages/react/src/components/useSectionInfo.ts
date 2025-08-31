import { atom, useAtomValue } from 'jotai';
import { use, useMemo } from 'react';
import { reportInfo, type SectionInfo } from './reportInfo';
import { SectionContext } from './SectionContext';

export const useSectionInfo = () => {
    const sectionName = use(SectionContext);
    const sectionAtom = useMemo(
        () =>
            atom(
                (get) =>
                    get(reportInfo).get(sectionName) ??
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
