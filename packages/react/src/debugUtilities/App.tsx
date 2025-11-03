import { useEffect, useMemo, useState } from 'react';
import * as Paprize from '@paprize/core/src';
import '@paprize/core/src/debug-styles.css';

import {
    ReportPreview,
    ReportRoot,
    Section,
    SectionHeader,
    PageHeader,
    PageFooter,
    SectionFooter,
    PageContent,
    PageBreak,
    usePageInfo,
    Layout,
    useSectionSuspension,
    useSectionInfo,
    useReportInfo,
} from '../index';
import { SectionTocPlugin } from '@paprize/core/src';
import { useReportBuilder } from '../internal/useReportBuilder';

export default function App() {
    const [name, setName] = useState('');
    //Paprize.enableDebugMode();
    Paprize.logger.setLevel('debug', false);

    const tocPlugin = useMemo(() => new SectionTocPlugin(), []);
    return (
        <ReportRoot>
            <input
                type="string"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            {/* <DevTools /> */}
            <ReportPreview>
                <Section
                    id="section-1"
                    size={{ height: '300px', width: '400px' }}
                    margin={{
                        top: '10px',
                        right: '10px',
                        bottom: '10px',
                        left: '10px',
                    }}
                    plugins={[Paprize.debugPlugin]}
                >
                    <PageContent>
                        <MyTOC tocProvider={tocPlugin} />
                    </PageContent>
                </Section>
                <Section
                    size={{ height: '400px', width: '400px' }}
                    margin={{
                        top: '10px',
                        right: '10px',
                        bottom: '10px',
                        left: '10px',
                    }}
                    plugins={[
                        Paprize.debugPlugin,
                        new Paprize.TablePlugin({ cloneHeader: true }),
                        tocPlugin,
                    ]}
                >
                    <SectionHeader>
                        <h2>Section Header</h2>
                    </SectionHeader>
                    <PageHeader>
                        <MyPageHeader />
                    </PageHeader>
                    <PageFooter>
                        <h3>Page Footer</h3>
                    </PageFooter>
                    <SectionFooter>
                        <h2>Section Footer</h2>
                    </SectionFooter>
                    {/* <PageOverlay>
                        <div
                            style={{
                                position: 'absolute',
                                zIndex: -1,
                                top: '50%',
                                transform: 'rotate(-90deg)',
                            }}
                        >
                            Report watermark
                        </div>
                    </PageOverlay> */}
                    <PageContent>
                        <h4>H4 |1| Title 1</h4>
                        <h5>H5 |1| Title 1.1 {name}</h5>
                        <p>1- {Paprize.createLoremIpsumParagraph(20, 0.2)}</p>
                        <p>2- {Paprize.createLoremIpsumParagraph(80, 0.3)}</p>
                        <MyTable />
                        <p>3- {Paprize.createLoremIpsumParagraph(80, 0.4)}</p>
                        <h4>H4 |1| Title 2</h4>
                        <p>1- end</p>
                    </PageContent>
                </Section>

                <Section
                    size={{ height: '600px', width: '400px' }}
                    margin={{
                        top: '10px',
                        right: '10px',
                        bottom: '10px',
                        left: '10px',
                    }}
                    plugins={[Paprize.debugPlugin, tocPlugin]}
                >
                    <SectionHeader>
                        <h1>Section 2 Header</h1>
                    </SectionHeader>
                    <PageHeader>
                        <h2>Page 2 Headers</h2>
                    </PageHeader>
                    <PageFooter>This is a footer 2</PageFooter>
                    <SectionFooter>Section 2 Footer</SectionFooter>
                    <PageContent>
                        <h4>H4 |2| Title 1</h4>
                        <p>1- {Paprize.createLoremIpsumParagraph(10, 0.5)}</p>
                        <PageBreak />
                        <h4>H4 |2| Title 2</h4>
                        <p>2- {Paprize.createLoremIpsumParagraph(100, 0.6)}</p>
                        <h5>H5 |2| Title 2.1</h5>
                        <Layout keepOnSamePage={false}>
                            <p style={{ border: '1px solid black' }}>
                                3- {Paprize.createLoremIpsumParagraph(100, 0.8)}
                            </p>
                        </Layout>
                        <p>4- {Paprize.createLoremIpsumParagraph(200, 0.9)}</p>
                        <p>5- {Paprize.createLoremIpsumParagraph(100, 0.1)}</p>
                    </PageContent>
                </Section>
            </ReportPreview>
        </ReportRoot>
    );
}

function MyPageHeader() {
    const { pageIndex, totalPages } = usePageInfo();

    return (
        <PageHeader>
            <h3>
                Page Header {pageIndex + 1} of {totalPages}
            </h3>
        </PageHeader>
    );
}

function MyTOC({ tocProvider }: { tocProvider: SectionTocPlugin }) {
    const reportBuilder = useReportBuilder();
    const { sections } = useReportInfo();
    const { sectionId } = useSectionInfo();
    const { release, reset } = useSectionSuspension();

    const allOtherArePaginated = sections.every((s) =>
        s.sectionId === sectionId ? !s.isPaginated : s.isPaginated
    );
    const tocIsReady = allOtherArePaginated && sections.length > 0;

    useEffect(() => {
        if (tocIsReady) {
            release();
        }
    }, [release, tocIsReady]);

    useEffect(() => {
        const unsubscribe = reportBuilder.monitor.addEventListener(
            'paginationCycleCompleted',
            (cc) => {
                const tocIsPaginated = cc.sections.some(
                    (s) => s.sectionId === sectionId && s.isPaginated
                );
                if (tocIsPaginated) {
                    reset();
                }
            }
        );

        return () => unsubscribe();
    }, [sectionId, reset, reportBuilder.monitor]);

    const sectionIndexMap = new Map(
        sections.map((s) => [s.sectionId, s.sectionIndex])
    );
    const pages = tocProvider.getContentList().sort((a, b) => {
        const aIndex =
            sectionIndexMap.get(a.sectionId) ?? 0 * 1000 + a.pageIndex;
        const bIndex =
            sectionIndexMap.get(b.sectionId) ?? 0 * 1000 + b.pageIndex;
        return aIndex - bIndex;
    });

    return (
        <nav>
            <ul>
                {pages.map((content, i) => (
                    <li key={i}>
                        <a href={`#${content.sectionId}-${content.pageIndex}`}>
                            {content.sectionId}/{content.title}/{content.level}{' '}
                            --
                            {content.pageIndex + 1}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

function MyTable() {
    return (
        <table>
            <thead>
                <tr>
                    <th>Header 1</th>
                    <th>Header 2</th>
                    <th>Header 3</th>
                </tr>
            </thead>
            <tbody>
                {Array.from({ length: 20 }).map((_, rowIndex) => (
                    <tr key={rowIndex}>
                        <td>Row {rowIndex + 1} - Cell 1</td>
                        <td>Row {rowIndex + 1} - Cell 2</td>
                        <td>Row {rowIndex + 1} - Cell 3 ddvd dvdv dvdvd</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
