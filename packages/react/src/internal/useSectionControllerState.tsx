import { useMemo } from 'react';
import { type SectionController } from './SectionControllerContext';
import type { PaginationPlugin } from '@paprize/core/src';

export function useSectionControllerState(plugins?: PaginationPlugin[]) {
    const state = useMemo(
        () => ({
            plugins: plugins ?? ([] as PaginationPlugin[]),
            suspense: [] as Promise<void>[],
        }),
        [plugins]
    );

    const sectionController: SectionController = useMemo(
        () => ({
            addPlugin: (plugin: PaginationPlugin) => {
                state.plugins.push(plugin);
            },
            addSuspense: (suspense: Promise<void>) => {
                state.suspense.push(suspense);
            },
        }),
        [state]
    );

    return {
        controllerState: state,
        controllerValue: sectionController,
    };
}
