import { useContext } from 'react';
import { PageInfoContext } from '../internal/PageInfoContext';
import type { PageInfo } from '../internal/eventHelper';

/**
 * React hook that returns information about the current page.
 */
export const usePageInfo = (): PageInfo => {
    const pageContext = useContext(PageInfoContext);

    return {
        pageIndex: pageContext.pageIndex,
        totalPages: pageContext.totalPages,
    };
};
