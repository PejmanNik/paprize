import { useId, useMemo } from 'react';
import { useSetSectionState } from './useSetSectionInfo';

export function useSectionSuspension(
    sectionName: string,
    suspend: boolean = true
) {
    const id = useId();
    const setSectionInfo = useSetSectionState(sectionName);

    useMemo(() => {
        if (!suspend) return;

        setSectionInfo((prev) => ({
            ...prev,
            pendingSuspensions: new Set(prev.pendingSuspensions).add(id),
        }));
    }, [id, setSectionInfo, suspend]);

    return useMemo(() => {
        return {
            release: () => {
                setSectionInfo((prev) => {
                    const pendingSuspensions = new Set(prev.pendingSuspensions);
                    pendingSuspensions.delete(id);

                    return {
                        ...prev,
                        pendingSuspensions,
                    };
                });
            },
        };
    }, [id, setSectionInfo]);
}
