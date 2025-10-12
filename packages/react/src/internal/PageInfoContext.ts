import { createContext } from 'react';

export const PageInfoContext = createContext<{
    pageIndex: number;
    totalPages: number;
}>({
    pageIndex: 0,
    totalPages: 0,
});
