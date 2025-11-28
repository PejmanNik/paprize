import { h } from 'preact';
import { expect, test } from '../../utils/PaprizePage';
import { createLoremIpsumParagraph } from '@paprize/core';

test('should render multiple sections with the correct sizes', async ({
    paprizePage,
}) => {
    const app = h('div', { id: 'app' }, [
        h('div', { id: 'section-1' }, [
            h('div', { id: 'page-content1' }, [
                h('p', {}, createLoremIpsumParagraph(100, 0.2)),
                h('p', {}, createLoremIpsumParagraph(100, 0.6)),
            ]),
        ]),
        h('div', { id: 'section-2' }, [
            h('div', { id: 'page-content2' }, [
                h('div', {
                    id: '1',
                    style: {
                        height: '200px',
                        backgroundColor: '#7ab6d1ff',
                    },
                }),
                h('div', {
                    id: '1',
                    style: {
                        height: '200px',
                        backgroundColor: '#7afb87ff',
                    },
                }),
            ]),
        ]),
    ]);

    await paprizePage.core.setup(app, () => {
        window.paprize.core.addSection(
            {
                id: 'section-1',
            },
            {
                pageContentId: 'page-content1',
            }
        );
        window.paprize.core.addSection(
            {
                id: 'section-2',
                size: { height: '700px', width: '500px' },
            },
            {
                pageContentId: 'page-content2',
            }
        );
    });

    await expect(paprizePage).toMatchReportSnapshot();
});
