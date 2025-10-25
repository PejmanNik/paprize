import { pageBreakAttributeName } from '@paprize/core/src';

export function PageBreak() {
    return <span {...{ [pageBreakAttributeName]: 'true' }} />;
}
