import { layoutOptionsToAttributes, type LayoutOptions } from '@paprize/core';

export interface LayoutProps extends LayoutOptions {
    children: React.ReactNode;
}

export function Layout({ children, ...attributes }: LayoutProps) {
    return (
        <div
            style={{ display: 'contents' }}
            {...layoutOptionsToAttributes(attributes)}
        >
            {children}
        </div>
    );
}
