import { useInsertionEffect } from 'react';

export function useStyle(css: string) {
    useInsertionEffect(() => {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
        return () => style.remove();
    }, [css]);
}
