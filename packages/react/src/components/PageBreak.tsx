import { pageBreakAttributeName } from '@paprize/core';

export function PageBreak() {
    return <span {...{ [pageBreakAttributeName]: 'true' }} />;
}
