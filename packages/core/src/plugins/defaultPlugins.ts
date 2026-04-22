import type { PaginationPlugin } from '../paginate/PaginationPlugin';
import { OrderedListPlugin } from './OrderedListPlugin';
import { PageBreakPlugin } from './PageBreakPlugin';
import { TablePlugin } from './TablePlugin';

export const defaultPlugins: PaginationPlugin[] = [
    new PageBreakPlugin(),
    new TablePlugin(),
    new OrderedListPlugin(),
];
