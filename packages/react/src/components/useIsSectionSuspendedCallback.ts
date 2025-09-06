import { useAtomCallback } from 'jotai/utils';
import { sectionsAtom } from './store';
import { useSectionInfo } from './useSectionInfo';

export function useIsSectionSuspendedCallback(sectionName: string) {
    // subscribe to reportInfoAtom[sectionName] changes
    useSectionInfo();

    // but read the live value
    const readCallback = useAtomCallback((get) => {
        const reportInfo = get(sectionsAtom);
        return (reportInfo.get(sectionName)?.pendingSuspensions?.size ?? 0) > 0;
    });

    return readCallback;
}
