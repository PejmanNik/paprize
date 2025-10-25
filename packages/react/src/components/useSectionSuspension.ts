import { useContext, useEffect, useMemo, useRef } from 'react';
import { SectionControllerContext } from '../internal/SectionControllerContext';

export function useSectionSuspension(
    promise: Promise<void> | Promise<unknown>
): void;
export function useSectionSuspension(): {
    release: () => void;
    reset: () => void;
};
export function useSectionSuspension(
    promise?: Promise<void> | Promise<unknown>
) {
    const resolveFn = useRef<() => void | null>(null);
    const { addSuspense } = useContext(SectionControllerContext);

    useEffect(() => {
        if (resolveFn.current) {
            return;
        }

        const pr =
            promise ??
            new Promise<void>((resolve) => {
                resolveFn.current = resolve;
            });
        resolveFn.current ||= () => {};

        addSuspense(pr as Promise<void>);
    }, [addSuspense, promise]);

    return useMemo(
        () => ({
            reset: () => {
                if (resolveFn.current) return;

                addSuspense(
                    new Promise<void>((resolve) => {
                        resolveFn.current = resolve;
                    })
                );
            },
            release: () => {
                resolveFn.current?.();
                resolveFn.current = null;
            },
        }),
        [addSuspense]
    );
}
