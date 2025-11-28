import { h } from 'preact';
import { expect, test } from '../../utils/PaprizePage';
import { pageBreakAttributeName } from '@paprize/core';

test('should start a new page after page break', async ({ paprizePage }) => {
    const app = h('div', { id: 'app' }, [
        h('div', { id: 'section-1' }, [
            h('div', { id: 'page-content' }, [
                h('div', {
                    id: '1',
                    style: {
                        height: '100px',
                        backgroundColor: '#8b8b8b',
                    },
                }),
                h('div', { [pageBreakAttributeName]: true }),
                h('div', {
                    id: '2',
                    style: {
                        height: '100px',
                        backgroundColor: '#dde8d0ff',
                    },
                }),
            ]),
        ]),
    ]);

    await paprizePage.core.setup(app);

    await expect(paprizePage).toMatchReportSnapshot();
});
