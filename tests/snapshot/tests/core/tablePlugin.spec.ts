import { h } from 'preact';
import { expect, test } from '../../utils/PaprizePage';

test('should move the table to the next page when no rows fit on the page', async ({
    paprizePage,
}) => {
    const app = h('div', { id: 'app' }, [
        h('div', { id: 'section-1' }, [
            h('div', { id: 'page-content' }, [
                h('div', {
                    id: '1',
                    style: {
                        height: '355px',
                        backgroundColor: '#8b8b8b',
                    },
                }),
                h('table', {}, [
                    h('thead', {}, [
                        h('tr', {}, [
                            h('th', {}, 'name'),
                            h('th', {}, 'last name'),
                            h('th', {}, 'age'),
                        ]),
                    ]),
                    h('tbody', {}, [
                        h('tr', {}, [
                            h('td', {}, 'Neo'),
                            h('td', {}, 'Anderson'),
                            h('td', {}, '25'),
                        ]),
                    ]),
                ]),
            ]),
        ]),
    ]);

    await paprizePage.core.setup(app);

    await expect(paprizePage).toMatchReportSnapshot();
});

test('should move the row to the next page when whole row cannot fit', async ({
    paprizePage,
}) => {
    const app = h('div', { id: 'app' }, [
        h('div', { id: 'section-1' }, [
            h('div', { id: 'page-content' }, [
                h('div', {
                    id: '1',
                    style: {
                        height: '340px',
                        backgroundColor: '#8b8b8b',
                    },
                }),
                h('table', {}, [
                    h('thead', {}, [
                        h('tr', {}, [
                            h('th', {}, 'name'),
                            h('th', {}, 'last name'),
                            h('th', {}, 'age'),
                        ]),
                    ]),
                    h('tbody', {}, [
                        h('tr', {}, [
                            h('td', {}, 'Neo'),
                            h(
                                'td',
                                {},
                                'Very long last name that cannot fit to this small page'
                            ),
                            h('td', {}, '25'),
                        ]),
                    ]),
                ]),
            ]),
        ]),
    ]);

    await paprizePage.core.setup(app);

    await expect(paprizePage).toMatchReportSnapshot();
});

test('should move the table to the next page when no rows fit and clone is enabled', async ({
    paprizePage,
}) => {
    const app = h('div', { id: 'app' }, [
        h('div', { id: 'section-1' }, [
            h('div', { id: 'page-content' }, [
                h('div', {
                    id: '1',
                    style: {
                        height: '350px',
                        backgroundColor: '#8b8b8b',
                    },
                }),
                h('table', {}, [
                    h('thead', {}, [
                        h('tr', {}, [
                            h('th', {}, 'name'),
                            h('th', {}, 'last name'),
                            h('th', {}, 'age'),
                        ]),
                    ]),
                    h('tbody', {}, [
                        h('tr', {}, [
                            h('td', {}, 'Neo'),
                            h('td', {}, 'Anderson'),
                            h('td', {}, '25'),
                        ]),
                    ]),
                ]),
                h('tfoot', {}, [
                    h('tr', {}, [
                        h('th', { scope: 'row', colspan: '2' }, 'avg age'),
                        h('td', {}, '31.6'),
                    ]),
                ]),
            ]),
        ]),
    ]);

    await paprizePage.core.setup(app, () => {
        window.paprize.core.addSection({
            plugins: [
                new window.paprize.core.lib.TablePlugin({
                    cloneFooter: true,
                    cloneHeader: true,
                }),
            ],
        });
    });

    await expect(paprizePage).toMatchReportSnapshot();
});

test('should clone the table header and footer onto each page', async ({
    paprizePage,
}) => {
    const app = h('div', { id: 'app' }, [
        h('div', { id: 'section-1' }, [
            h('div', { id: 'page-content' }, [
                h('div', {
                    id: '1',
                    style: {
                        height: '300px',
                        backgroundColor: '#8b8b8b',
                    },
                }),
                h('table', {}, [
                    h('thead', {}, [
                        h('tr', {}, [
                            h('th', {}, 'name'),
                            h('th', {}, 'last name'),
                            h('th', {}, 'age'),
                        ]),
                    ]),
                    h(
                        'tbody',
                        {},
                        [...Array(20)].map((_, i) =>
                            h('tr', {}, [
                                h('td', {}, 'Neo'),
                                h('td', {}, i.toString()),
                                h('td', {}, '25'),
                            ])
                        )
                    ),
                    h('tfoot', {}, [
                        h('tr', {}, [
                            h('th', { scope: 'row', colspan: '2' }, 'avg age'),
                            h('td', {}, '31.6'),
                        ]),
                    ]),
                ]),
            ]),
        ]),
    ]);

    await paprizePage.core.setup(app, () => {
        window.paprize.core.addSection({
            plugins: [
                new window.paprize.core.lib.TablePlugin({
                    cloneFooter: true,
                    cloneHeader: true,
                }),
            ],
        });
    });

    await expect(paprizePage).toMatchReportSnapshot();
});

test('should not clone the header and footer table when it fit to the page', async ({
    paprizePage,
}) => {
    const app = h('div', { id: 'app' }, [
        h('div', { id: 'section-1' }, [
            h('div', { id: 'page-content' }, [
                h('table', {}, [
                    h('thead', {}, [
                        h('tr', {}, [
                            h('th', {}, 'name'),
                            h('th', {}, 'last name'),
                            h('th', {}, 'age'),
                        ]),
                    ]),
                    h('tbody', {}, [
                        h('tr', {}, [
                            h('td', {}, 'Neo'),
                            h('td', {}, 'Anderson'),
                            h('td', {}, '25'),
                        ]),
                        h('tr', {}, [
                            h('td', {}, 'Trinity'),
                            h('td', {}, '-'),
                            h('td', {}, '30'),
                        ]),
                        h('tr', {}, [
                            h('td', {}, 'Smith'),
                            h('td', {}, 'Agent'),
                            h('td', {}, '40'),
                        ]),
                    ]),
                ]),
                h('tfoot', {}, [
                    h('tr', {}, [
                        h('th', { scope: 'row', colspan: '2' }, 'avg age'),
                        h('td', {}, '31.6'),
                    ]),
                ]),
            ]),
        ]),
    ]);

    await paprizePage.core.setup(app, () => {
        window.paprize.core.addSection({
            plugins: [
                new window.paprize.core.lib.TablePlugin({
                    cloneFooter: true,
                    cloneHeader: true,
                }),
            ],
        });
    });

    await expect(paprizePage).toMatchReportSnapshot();
});

test('should not clone header and footer when table has no body row', async ({
    paprizePage,
}) => {
    const app = h('div', { id: 'app' }, [
        h('div', { id: 'section-1' }, [
            h('div', { id: 'page-content' }, [
                h('div', {
                    id: '1',
                    style: {
                        height: '340px',
                        backgroundColor: '#8b8b8b',
                    },
                }),
                h('table', {}, [
                    h('thead', {}, [
                        h('tr', {}, [
                            h('th', {}, 'name'),
                            h('th', {}, 'last name'),
                            h('th', {}, 'age'),
                        ]),
                    ]),
                    h('tfoot', {}, [
                        h('tr', {}, [
                            h('th', { scope: 'row', colspan: '2' }, 'avg age'),
                            h('td', {}, '31.6'),
                        ]),
                    ]),
                ]),
            ]),
        ]),
    ]);

    await paprizePage.core.setup(app, () => {
        window.paprize.core.addSection({
            plugins: [
                new window.paprize.core.lib.TablePlugin({
                    cloneFooter: true,
                    cloneHeader: true,
                }),
            ],
        });
    });

    await expect(paprizePage).toMatchReportSnapshot();
});
