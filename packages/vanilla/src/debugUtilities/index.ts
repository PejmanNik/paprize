import { h, render } from 'preact';
import * as Paprize from '../index';
import { createLoremIpsumParagraph, pageMargin } from '@paprize/core';
import { PaprizeReport } from '../PaprizeReport';

const App = () => {
    return h('div', { [Paprize.previewAttribute]: true }, [
        h(
            'div',
            {
                [Paprize.sectionAttribute]: true,
                id: '1',
            },
            [
                h(
                    'div',
                    {
                        [Paprize.pageHeaderAttribute]: true,
                    },
                    h('h3', null, 'This is a S1 Page header')
                ),
                h(
                    'div',
                    { [Paprize.pageFooterAttribute]: true },
                    h('h4', null, 'This is a S1 Page footer')
                ),
                h('div', { [Paprize.pageContentAttribute]: true }, [
                    h('div', { id: '1' }, [
                        h('h1', { id: '1.1' }, 'Title  S1'),
                        h('div', { id: '1.2' }, [
                            h('span', {}, ' Page Number: '),
                            h('span', {
                                [Paprize.pageNumberValueAttribute]: true,
                            }),
                            h('span', {}, ' Total Pages: '),
                            h('span', {
                                [Paprize.totalPagesValueAttribute]: true,
                            }),
                            h('span', {}, ' Section Number: '),
                            h('span', {
                                [Paprize.sectionNumberValueAttribute]: true,
                            }),
                            h('span', {}, ' Total Sections: '),
                            h('span', {
                                [Paprize.totalSectionsValueAttribute]: true,
                            }),
                            h(
                                'p',
                                { id: '1.2' },
                                createLoremIpsumParagraph(80, 0.2)
                            ),
                            h(
                                'p',
                                { id: '1.3' },
                                createLoremIpsumParagraph(90, 0.4)
                            ),
                        ]),
                    ]),
                ]),
            ]
        ),
        ///
        h(
            'div',
            {
                [Paprize.sectionAttribute]: true,
                id: '2',
            },
            [
                h(
                    'div',
                    { [Paprize.sectionHeaderAttribute]: true },
                    h('h1', null, 'This is a Section header')
                ),
                h(
                    'div',
                    { [Paprize.sectionFooterAttribute]: true },
                    h('h3', null, 'This is a Section footer')
                ),
                h(
                    'div',
                    {
                        [Paprize.pageHeaderAttribute]: true,
                    },
                    h('h3', null, 'This is a Page header')
                ),
                h(
                    'div',
                    { [Paprize.pageFooterAttribute]: true },
                    h('h4', null, 'This is a Page footer')
                ),
                h('div', { [Paprize.pageContentAttribute]: true }, [
                    h('div', { id: '11' }, [
                        h('h1', { id: '111.1' }, 'Title 1'),
                        h('div', { id: '111.2' }, [
                            h(
                                'p',
                                { id: '111.2' },
                                createLoremIpsumParagraph(80, 0.2)
                            ),
                        ]),
                    ]),

                    h('div', { id: '22' }, [
                        h('h1', { id: '22.1' }, 'Title 2'),
                        h('div', { id: '222.2' }, [
                            h(
                                'p',
                                { id: '22.2.1' },
                                createLoremIpsumParagraph(60, 0.3)
                            ),
                            h(
                                'p',
                                {
                                    id: '2.2.2',
                                    style: { wordBreak: 'break-all' },
                                },
                                Array.from(
                                    { length: 400 },
                                    (_, i) => i + 1
                                ).join(',')
                            ),
                            h('h3', { id: '2.3' }, 'End'),
                        ]),
                    ]),
                ]),
            ]
        ),
    ]);
};

render(App(), document.body);

let resolve: () => void;
const myPromise = new Promise<void>((res) => {
    resolve = res;
});

const r = new PaprizeReport();
await r.addSection({
    id: '1',
    size: { height: '350px', width: '400px' },
    margin: pageMargin.None,
});

await r.addSection({
    id: '2',
    size: { height: '350px', width: '400px' },
    margin: pageMargin.None,
    suspense: [myPromise],
});

r.monitor.addEventListener('pageCompleted', (pageContext) => {
    if (pageContext.components.pageHeader) {
        pageContext.components.pageHeader.innerHTML = `<h4>Page Header ${pageContext.pageIndex + 1} of ${pageContext.totalPages}</h4>`;
    }
});

(async () => {
    await r.schedulePagination();

    setTimeout(() => {
        resolve();
    }, 2000);
})();
