import { h } from 'preact';
import { expect, test } from '../../utils/PaprizePage';
import { createLoremIpsumParagraph } from '@paprize/core';

test('should keeps numbered lists correctly when their content splits across multiple pages', async ({
    paprizePage,
}) => {
    const app = h('div', { id: 'app' }, [
        h('div', { id: 'section-1' }, [
            h('div', { id: 'page-content' }, [
                h('div', { style: { height: 300 } }, []),
                h('ol', {}, [
                    h('li', {}, createLoremIpsumParagraph(3, 0.1)),
                    h('li', {}, createLoremIpsumParagraph(3, 0.2)),
                    h('li', {}, createLoremIpsumParagraph(15, 0.3)),
                    h('li', {}, createLoremIpsumParagraph(4, 0.4)),
                ]),
            ]),
        ]),
    ]);

    await paprizePage.core.setup(app);

    await expect(paprizePage).toMatchReportSnapshot();
});

test('should keeps nested numbered lists correctly when their content splits across multiple pages', async ({
    paprizePage,
}) => {
    const app = h('div', { id: 'app' }, [
        h('div', { id: 'section-1' }, [
            h('div', { id: 'page-content' }, [
                h('div', { style: { height: 300 } }, []),
                h('ol', { start: 3 }, [
                    h('li', {}, createLoremIpsumParagraph(3, 0.1)),
                    h('li', {}, createLoremIpsumParagraph(3, 0.2)),
                    h('li', {}, createLoremIpsumParagraph(15, 0.3)),
                    h('ol', {}, [
                        h('li', {}, createLoremIpsumParagraph(25, 0.6)),
                        h('li', {}, createLoremIpsumParagraph(25, 0.7)),
                        h('li', {}, createLoremIpsumParagraph(25, 0.8)),
                        h('li', {}, createLoremIpsumParagraph(4, 0.9)),
                    ]),
                    h('li', {}, createLoremIpsumParagraph(4, 0.4)),
                ]),
            ]),
        ]),
    ]);

    await paprizePage.core.setup(app);

    await expect(paprizePage).toMatchReportSnapshot();
});
