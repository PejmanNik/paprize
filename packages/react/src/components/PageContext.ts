import { createContext } from 'react';

export const PageContext = createContext<{
    pageNumber: number;
    totalPages: number;
}>({
    pageNumber: 0,
    totalPages: 0,
});
