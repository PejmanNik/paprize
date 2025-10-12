import { paprize_readJsonDataFile } from '@paprize/core/src';
import { useSectionSuspension } from './useSectionSuspension';

function lazy<T>(factory: () => Promise<T>): () => Promise<T> {
    let promise: Promise<T> | null = null;

    return () => {
        if (!promise) {
            promise = factory();
        }
        return promise;
    };
}

// the function is not available in browser, and in puppeteer it is injected before anything else but we
// still need to delay the call
export const jsonData = lazy(async () => {
    if (!(paprize_readJsonDataFile in window)) {
        throw new Error('The function paprize_readJsonDataFile is not available in the current environment.');
    }

    const strData = await window[paprize_readJsonDataFile]?.();
    return strData ? (JSON.parse(strData) as unknown) : null;
});

export function useJsonData<DataModel>(
    defaultValue?: DataModel
): DataModel | undefined {
    return useSectionSuspension(jsonData().catch(() => defaultValue)) as
        | DataModel
        | undefined;
}
