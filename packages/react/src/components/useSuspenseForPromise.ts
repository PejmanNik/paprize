import { logger } from '@paprize/core';
import { useState, useMemo, useEffect } from 'react';
import { useSectionInfo } from './useSectionInfo';
import { useSectionSuspension } from './useSectionSuspension';

export interface State<T> {
    state: 'loading' | 'hasData' | 'hasError';
    value?: T;
}

export function useSuspenseForPromise<T>(
    promise: Promise<T>,
    defaultValue?: T
): T | undefined {
    const { sectionId } = useSectionInfo();
    const { release } = useSectionSuspension(sectionId);
    const [value, setValue] = useState<State<T>>({
        state: 'loading',
        value: defaultValue,
    });

    useMemo(() => {
        promise
            .then((v) => setValue({ state: 'hasData', value: v }))
            .catch((e) => {
                setValue({ state: 'hasError', value: e });
                logger.error('Error in useSuspenseForPromise', e);
            });
    }, [promise]);

    useEffect(() => {
        if (value.state !== 'loading') {
            release();
        }
    }, [value, release]);

    return value.value as T | undefined;
}
