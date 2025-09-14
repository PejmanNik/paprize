import { type ReactNode } from 'react';
import { Provider } from 'jotai';
import { ReportStatus } from './ReportStatus';
import { store } from './store';
import { useStyle } from './useStyle';

export interface ReportRootProps {
    children: ReactNode;
}

const globalStyles = `
    html {
        box-sizing: border-box;
    }

    *,
    *:before,
    *:after {
        box-sizing: inherit;
    }

    .paprize-page-component {
        display: flex;
        flex-direction: column;
    }
`;

export function ReportRoot({ children }: ReportRootProps) {
    useStyle(globalStyles);
    return (
        <Provider store={store}>
            {children}
            <ReportStatus />
        </Provider>
    );
}
