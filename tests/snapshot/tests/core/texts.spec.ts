import { h } from 'preact';
import {
    createLoremIpsumParagraph,
    layoutOptionHyphenationDisabledAttribute,
    layoutOptionHyphenAttribute,
} from '@paprize/core';
import { test, expect } from '../../utils/PaprizePage';

test('should paginate normal text and preserve paragraphs', async ({
    paprizePage,
}) => {
    const app = h('div', { id: 'app' }, [
        h('div', { id: 'section-1' }, [
            h('div', { id: 'page-content' }, [
                h('h1', { id: '1' }, 'Part 1'),
                h('h3', { id: '2' }, 'Sub Part 1.1'),
                h('div', { id: '3' }, [
                    h('p', { id: '3.1' }, createLoremIpsumParagraph(80, 0.2)),
                    h('p', { id: '3.2' }, createLoremIpsumParagraph(80, 0.3)),
                ]),
                h('p', { id: '4' }, createLoremIpsumParagraph(35, 0.5)),
                h('div', { id: '5' }, [
                    h('h1', { id: '5.1' }, 'Part 2'),
                    h('div', { id: '5.2' }, [
                        h('div', { id: '5.2.1' }, [
                            h(
                                'p',
                                { id: '5.2.1.1' },
                                createLoremIpsumParagraph(80, 0.1)
                            ),
                        ]),
                        h(
                            'p',
                            { id: '5.2.2' },
                            createLoremIpsumParagraph(10, 0.9)
                        ),
                    ]),
                    h('p', { id: '5.3' }, createLoremIpsumParagraph(20, 0.4)),
                ]),
            ]),
        ]),
    ]);

    await paprizePage.core.setup(app);

    await expect(paprizePage).toMatchReportSnapshot();
});

test('should move long unbreakable word to next page when it fits', async ({
    paprizePage,
}) => {
    const app = h('div', { id: 'app' }, [
        h('div', { id: 'section-1' }, [
            h('div', { id: 'page-content' }, [
                h('h1', { id: '1' }, 'Part 1'),
                h('div', { id: '2' }, [
                    h('p', { id: '2.1' }, createLoremIpsumParagraph(40, 0.2)),
                ]),
                h(
                    'p',
                    { id: '3', style: { wordBreak: 'break-all' } },
                    Array.from({ length: 100 }, (_, i) => i + 1).join(',')
                ),
            ]),
        ]),
    ]);

    await paprizePage.core.setup(app);

    await expect(paprizePage).toMatchReportSnapshot();
});

test("should hyphenate long unbreakable word when it doesn't fit on next page", async ({
    paprizePage,
}) => {
    const app = h('div', { id: 'app' }, [
        h('div', { id: 'section-1' }, [
            h('div', { id: 'page-content' }, [
                h('h1', { id: '1' }, 'Part 1'),
                h('div', { id: '2' }, [
                    h('p', { id: '2.1' }, createLoremIpsumParagraph(40, 0.2)),
                ]),
                h(
                    'p',
                    { id: '3', style: { wordBreak: 'break-all' } },
                    Array.from({ length: 400 }, (_, i) => i + 1).join(',')
                ),
            ]),
        ]),
    ]);

    await paprizePage.core.setup(app);

    await expect(paprizePage).toMatchReportSnapshot();
});

test('should use layout hyphen character when hyphenating long words', async ({
    paprizePage,
}) => {
    const app = h('div', { id: 'app' }, [
        h('div', { id: 'section-1' }, [
            h('div', { id: 'page-content' }, [
                h(
                    'p',
                    {
                        id: '3',
                        [layoutOptionHyphenAttribute]: '*',
                        style: { wordBreak: 'break-all' },
                    },
                    Array.from({ length: 400 }, (_, i) => i + 1).join(',')
                ),
            ]),
        ]),
    ]);

    await paprizePage.core.setup(app);

    await expect(paprizePage).toMatchReportSnapshot();
});

test('should ignore long words when hyphenation is disabled on container', async ({
    paprizePage,
}) => {
    const app = h('div', { id: 'app' }, [
        h('div', { id: 'section-1' }, [
            h('div', { id: 'page-content' }, [
                h(
                    'div',
                    {
                        id: '2',
                        [layoutOptionHyphenationDisabledAttribute]: 'true',
                    },
                    [
                        h('p', { id: '1' }, createLoremIpsumParagraph(10, 0.2)),
                        h(
                            'p',
                            { id: '2', style: { wordBreak: 'break-all' } },
                            Array.from({ length: 400 }, (_, i) => i + 1).join(
                                ','
                            )
                        ),
                        h('p', { id: '3' }, createLoremIpsumParagraph(10, 0.4)),
                    ]
                ),
            ]),
        ]),
    ]);

    await paprizePage.core.setup(app);

    await expect(paprizePage).toMatchReportSnapshot();
});
