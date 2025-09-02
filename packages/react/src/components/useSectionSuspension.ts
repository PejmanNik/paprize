import { useId, useMemo } from 'react';
import { useSetSectionInfo } from './useSetSectionInfo';

export function useSectionSuspension(sectionName: string) {
    const id = useId();
    const setSectionInfo = useSetSectionInfo(sectionName);

    useMemo(() => {
        setSectionInfo((prev) => ({
            ...prev,
            pendingSuspensions: prev.pendingSuspensions.add(id),
        }));
    }, [id, setSectionInfo]);

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
