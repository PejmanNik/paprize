import { atom, useSetAtom } from 'jotai';
import { useMemo } from 'react';
import { reportInfoAtom, type SectionInfo } from './reportInfo';

export const useSetSectionInfo = (sectionName: string) => {
    const sectionAtom = useMemo(
        () =>
            atom(
                () => 0,
                (_, set, update: (pre: SectionInfo) => SectionInfo) => {
                    set(reportInfoAtom, (prev) =>
                        new Map(prev).set(
                            sectionName,
                            update(
                                prev.get(sectionName) ?? {
                                    pendingSuspensions: new Set(),
                                    totalPages: 0,
                                }
                            )
                        )
                    );
                }
            ),
        [sectionName]
    );

    return useSetAtom(sectionAtom);
};
