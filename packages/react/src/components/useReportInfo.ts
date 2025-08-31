import { useAtomValue } from 'jotai';
import { reportInfo } from './reportInfo';
import { useMemo } from 'react';

export function useReportInfo() {
    const value = useAtomValue(reportInfo);

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
