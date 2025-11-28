import { h } from 'preact';
import { expect, test } from '../../utils/PaprizePage';
import { layoutOptionKeepOnSamePageAttribute } from '@paprize/core';

test('should move unbreakable element to next page when it does not fit', async ({
    paprizePage,
}) => {
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
                h('div', {
                    id: '2',
                    style: {
                        height: '200px',
                        backgroundColor: '#dde8d0ff',
                    },
                }),
                h('div', {
                    id: '2',
                    style: {
                        height: '150px',
                        backgroundColor: '#d0d7e8ff',
                    },
                }),
            ]),
        ]),
    ]);

    await paprizePage.core.setup(app);

    await expect(paprizePage).toMatchReportSnapshot();
});

test('should break element when it does not fit', async ({ paprizePage }) => {
    const app = h('div', { id: 'app' }, [
        h('div', { id: 'section-1' }, [
            h('div', { id: 'page-content' }, [
                h('div', {
                    id: '1',
                    style: {
                        height: '250px',
                        backgroundColor: '#8b8b8b',
                    },
                }),
                h(
                    'div',
                    {
                        id: '2',
                        style: {
                            border: 'solid 4px #970000ff',
                        },
                    },
                    [
                        h(
                            'div',
                            {
                                id: '2.1',
                                style: {
                                    border: 'solid 4px #007278ff',
                                },
                            },
                            [
                                h('div', {
                                    id: '2.1.1',
                                    style: {
                                        height: '90px',
                                        backgroundColor: '#d0d7e8ff',
                                    },
                                }),
                                h('div', {
                                    id: '2.1.1',
                                    style: {
                                        height: '90px',
                                        backgroundColor: '#d0e5e8ff',
                                    },
                                }),
                            ]
                        ),
                        h('div', {
                            id: '2.2',
                            style: {
                                height: '150px',
                                backgroundColor: '#dee8d0ff',
                            },
                        }),
                        h('div', {
                            id: '2.3',
                            style: {
                                height: '160px',
                                backgroundColor: '#e8d0e7ff',
                            },
                        }),
                    ]
                ),
            ]),
        ]),
    ]);

    await paprizePage.core.setup(app);

    await expect(paprizePage).toMatchReportSnapshot();
});

test('should not break element with KeepOnSamePage when it does not fit', async ({
    paprizePage,
}) => {
    const app = h('div', { id: 'app' }, [
        h('div', { id: 'section-1' }, [
            h('div', { id: 'page-content' }, [
                h('div', {
                    id: '1',
                    style: {
                        height: '105px',
                        backgroundColor: '#8b8b8b',
                    },
                }),
                h(
                    'div',
                    {
                        id: '1',
                        [layoutOptionKeepOnSamePageAttribute]: true,
                    },
                    [
                        h('div', {
                            id: '2',
                            style: {
                                height: '100px',
                                backgroundColor: '#dde8d0ff',
                            },
                        }),
                        h('div', {
                            id: '2',
                            style: {
                                height: '200px',
                                backgroundColor: '#d0d7e8ff',
                            },
                        }),
                    ]
                ),
            ]),
        ]),
    ]);

    await paprizePage.core.setup(app);

    await expect(paprizePage).toMatchReportSnapshot();
});
