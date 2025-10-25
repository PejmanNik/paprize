import { attributePrefix, pageClassName } from '../constants';
import type { PaginationPlugin } from '../paginate/PaginationPlugin';

export const debugPlugin: PaginationPlugin = {
    name: 'debug',
    order: Number.MAX_SAFE_INTEGER,
    onNewPage: (_, pageManager) => {
        const page = pageManager.getPageState().currentPage.getNode();

        if (!page.classList.contains(pageClassName)) {
            page.classList.add(pageClassName);
        }

        page.setAttribute(`${attributePrefix}-element`, 'page');
        page.setAttribute(
            `${attributePrefix}-height`,
            pageManager.getPageState().pageHeight.toString()
        );
    },
};
