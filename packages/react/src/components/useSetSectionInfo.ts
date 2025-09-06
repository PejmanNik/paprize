import { atom, useSetAtom } from 'jotai';
import { useMemo } from 'react';
import { defaultSectionState, sectionsAtom, type SectionState } from './store';

export const useSetSectionState = (sectionName: string) => {
    const sectionAtom = useMemo(
        () =>
            atom(
                () => 0,
                (_, set, update: (pre: SectionState) => SectionState) => {
                    set(sectionsAtom, (prev) =>
                        new Map(prev).set(
                            sectionName,
                            update(prev.get(sectionName) ?? defaultSectionState)
                        )
                    );
                }
            ),
        [sectionName]
    );

    return useSetAtom(sectionAtom);
};
