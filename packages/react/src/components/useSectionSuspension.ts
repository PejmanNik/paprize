import { useContext, useEffect, useMemo, useRef } from 'react';
import { SectionControllerContext } from '../internal/SectionControllerContext';

/**
 * Controls the section suspension.
 * @inline
 */
export interface SectionSuspension {
    /**
     * Releases the suspension. The pagination engine will paginate this section immediately.
     */
    release: () => void;

    /**
     * Marks the suspension as pending again if it was previously resolved.
     * During the next pagination cycle (for example, if pagination is retriggered
     * by changes to the page content), this section will not be paginated
     * until `release` is called again.
     */
    reset: () => void;
}

/**
 * Suspends pagination for this section.
 * @param promise The suspension is tied to this promise. Once the promise is resolved,
 * the suspension is released and the pagination engine will paginate this section.
 */
export function useSectionSuspension(
    promise: Promise<void> | Promise<unknown>
): void;
/**
 * Suspends pagination for this section. You need to call the `release` method
 * of the returned value; otherwise, the pagination engine will never paginate this section.
 */
export function useSectionSuspension(): SectionSuspension;
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
