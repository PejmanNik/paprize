import { useMemo, useRef } from 'react';
import { type SectionController } from './SectionControllerContext';
import type { PaginationPlugin } from '@paprize/core/src';

export function useSectionControllerState(plugins?: PaginationPlugin[]) {
    const state = useRef({
        plugins: plugins ?? ([] as PaginationPlugin[]),
        suspense: [] as Promise<void>[],
    });

    const sectionController: SectionController = useMemo(
        () => ({
            addPlugin: (plugin: PaginationPlugin) => {
                state.current.plugins.push(plugin);
            },
            addSuspense: (suspense: Promise<void>) => {
                state.current.suspense.push(suspense);
            },
        }),
        []
    );

    return {
        controllerState: state.current,
        controllerValue: sectionController,
    };
}
