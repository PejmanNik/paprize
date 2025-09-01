import { configToAttributeMap, type ConfigAttribute } from '@paprize/core/src';

export interface LayoutProps extends ConfigAttribute {
    children: React.ReactNode;
}
export function Layout({ children, ...attributes }: LayoutProps) {
    return (
        <div
            style={{ display: 'contents' }}
            {...configToAttributeMap(attributes)}
        >
            {children}
        </div>
    );
}
