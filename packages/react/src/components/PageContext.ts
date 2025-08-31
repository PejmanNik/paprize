import { createContext } from 'react';

export const PageContext = createContext<{ pageNumber: number }>({
    pageNumber: 0,
});
