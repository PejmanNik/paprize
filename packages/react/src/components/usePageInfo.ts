import { useContext } from 'react';
import { PageContext } from './PageContext';

export const usePageInfo = () => {
    const pageContext = useContext(PageContext);

    return {
        pageNumber: pageContext.pageNumber,
        totalPages: pageContext.totalPages,
    };
};
