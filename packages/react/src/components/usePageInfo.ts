import { use } from 'react';
import { PageContext } from './PageContext';

export const usePageInfo = () => {
    const pageContext = use(PageContext);

    return {
        pageNumber: pageContext.pageNumber,
    };
};
