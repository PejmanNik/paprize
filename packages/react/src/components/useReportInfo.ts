import { useAtomValue } from 'jotai';
import { reportInfoAtom } from './reportInfo';
import { useMemo } from 'react';

export function useReportInfo() {
    const value = useAtomValue(reportInfoAtom);

    return useMemo(
        () => ({
            sections: Array.from(value.entries()).map(
                ([key, { totalPages }]) => ({
                    sectionName: key,
                    totalPages,
                })
            ),
        }),
        [value]
    );
}
