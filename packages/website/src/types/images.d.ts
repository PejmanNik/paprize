declare module '@site/static/img/*.png' {
    const content: string;
    export default content;
}

declare module '@site/static/img/*.svg' {
    import { FC } from 'react';
    import { SVGComponentProps } from '../pages/components/types';

    const SvgComponent: FC<SVGComponentProps>;
    export default SvgComponent;
}
