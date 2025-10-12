import { useContext } from 'react';
import { PageInfoContext } from '../internal/PageInfoContext';

export const usePageInfo = () => {
    const pageContext = useContext(PageInfoContext);

    return {
        pageIndex: pageContext.pageIndex,
        totalPages: pageContext.totalPages,
    };
};
