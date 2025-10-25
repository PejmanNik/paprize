import type { PaginationPlugin } from '@paprize/core/src';
import { createContext } from 'react';

export interface SectionController {
    addPlugin: (plugin: PaginationPlugin) => void;
    addSuspense: (suspense: Promise<void>) => void;
}

export const SectionControllerContext = createContext<SectionController>({
    addPlugin: () => {
        throw new Error('addPlugin must be used within a Section');
    },
    addSuspense: () => {
        throw new Error('addSuspense must be used within a Section');
    },
});
