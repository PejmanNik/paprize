import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { paprize_isReady } from '@paprize/core/src';
import { reportAtom, sectionsAtom } from './store';

export function ReportStatus() {
    const setReport = useSetAtom(reportAtom);
    const sections = useAtomValue(sectionsAtom);

    useEffect(() => {
        const sectionsLen = sections.size;
        const allSectionsReady = Array.from(sections.values()).every(
            (info) => info.isPaginated
        );

        window[paprize_isReady] = allSectionsReady;
        setReport({
            isPaginated: allSectionsReady && sectionsLen > 0,
            totalSections: sectionsLen,
        });
    }, [sections, setReport]);

    return null;
}
