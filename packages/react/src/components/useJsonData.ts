import { useSectionSuspension } from './useSectionSuspension';
import { useReportBuilder } from '../internal/useReportBuilder';
import { useEffect, useMemo } from 'react';

/**
 * {@inheritDoc @paprize/core!ReportBuilder.getJsonData}
 */
export function useJsonData<DataModel>(
    defaultValue?: DataModel
): DataModel | null {
    const reportBuilder = useReportBuilder();
    const value = useMemo(
        () => ({
            current: null as DataModel | null,
        }),
        []
    );

    const promise = useMemo(
        () => reportBuilder.getJsonData(defaultValue),
        [defaultValue, reportBuilder]
    );

    useSectionSuspension(promise);

    useEffect(() => {
        promise.then((v) => (value.current = v));
    }, [promise, value]);

    return value.current ?? defaultValue ?? null;
}
