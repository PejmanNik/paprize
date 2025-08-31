import type { ReactNode } from 'react';
import { Provider } from 'jotai';
import { css, Global } from '@emotion/react';

export interface ReportRootProps {
    children: ReactNode;
}

const globalStyles = css`
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
    return (
        <Provider>
            <Global styles={globalStyles} />
            {children}
        </Provider>
    );
}
