import { h } from 'preact';
import { createLoremIpsumParagraph } from '@paprize/core';
import { expect, test } from '../../utils/PaprizePage';

test('should reduce available space for header and footer on every page', async ({
    paprizePage,
}) => {
    const app = h('div', { id: 'app' }, [
        h('div', { id: 'section-1' }, [
            h('div', { id: 'page-header' }, [
                h('h1', {}, 'This is the header'),
            ]),
            h('div', { id: 'page-footer' }, [
                h('h3', {}, 'This is the footer'),
            ]),
            h('div', { id: 'page-content' }, [
                h('p', { id: '1' }, createLoremIpsumParagraph(100, 0.2)),
                h('p', { id: '2' }, createLoremIpsumParagraph(50, 0.4)),
            ]),
        ]),
    ]);

    await paprizePage.core.setup(app, () => {
        window.paprize.core.addSection(undefined, {
            pageFooterId: 'page-footer',
            pageHeaderId: 'page-header',
        });
    });

    await expect(paprizePage).toMatchReportSnapshot();
});

test('should reduce available space for section header and footer on first and last pages', async ({
    paprizePage,
}) => {
    const app = h('div', { id: 'app' }, [
        h('div', { id: 'section-1' }, [
            h('div', { id: 'page-header' }, [
                h('h3', {}, 'This is the header'),
            ]),
            h('div', { id: 'page-footer' }, [
                h('h3', {}, 'This is the footer'),
            ]),
            h('div', { id: 'section-header' }, [
                h('h1', {}, 'This is the section header'),
            ]),
            h('div', { id: 'section-footer' }, [
                h('h1', {}, 'This is the section footer'),
            ]),
            h('div', { id: 'page-content' }, [
                h('p', { id: '1' }, createLoremIpsumParagraph(100, 0.2)),
                h('p', { id: '2' }, createLoremIpsumParagraph(100, 0.4)),
                h('p', { id: '3' }, createLoremIpsumParagraph(37, 0.8)),
            ]),
        ]),
    ]);

    await paprizePage.core.setup(app, () => {
        window.paprize.core.addSection(undefined, {
            pageFooterId: 'page-footer',
            pageHeaderId: 'page-header',
            sectionFooterId: 'section-footer',
            sectionHeaderId: 'section-header',
        });
    });

    await expect(paprizePage).toMatchReportSnapshot();
});

test("should create an empty page if section footer doesn't fit", async ({
    paprizePage,
}) => {
    const app = h('div', { id: 'app' }, [
        h('div', { id: 'section-1' }, [
            h('div', { id: 'section-footer' }, [
                h(
                    'h1',
                    { style: { margin: '80px 0' } },
                    'This is the section footer'
                ),
            ]),
            h('div', { id: 'page-content' }, [
                h('p', { id: '1' }, createLoremIpsumParagraph(100, 0.2)),
            ]),
        ]),
    ]);

    await paprizePage.core.setup(app, () => {
        window.paprize.core.addSection(undefined, {
            sectionFooterId: 'section-footer',
        });
    });

    await expect(paprizePage).toMatchReportSnapshot();
});
