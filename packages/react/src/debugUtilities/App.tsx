import { useEffect } from 'react';
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
import { SectionTocPlugin, type SectionTocState } from '@paprize/core/src';
import 'jotai-devtools/styles.css';

export default function App() {
    //Paprize.enableDebugMode();
    Paprize.logger.setLevel('debug', false);

    const tocPlugin = new SectionTocPlugin();
    return (
        <ReportRoot>
            {/* <DevTools /> */}
            <ReportPreview>
                <Section
                    dimension={{ height: '300px', width: '400px' }}
                    margin={{
                        top: '10px',
                        right: '10px',
                        bottom: '10px',
                        left: '10px',
                    }}
                    config={{
                        id: 'section-1',
                        plugins: [Paprize.debugPlugin],
                    }}
                >
                    <PageContent>
                        <MyTOC contentList={tocPlugin.state} />
                    </PageContent>
                </Section>
                <Section
                    dimension={{ height: '300px', width: '400px' }}
                    margin={{
                        top: '10px',
                        right: '10px',
                        bottom: '10px',
                        left: '10px',
                    }}
                    config={{
                        plugins: [Paprize.debugPlugin, tocPlugin],
                    }}
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
                        <h4>Part 1</h4>
                        <p>1- {Paprize.createLoremIpsumParagraph(20, 0.2)}</p>
                        <p>2- {Paprize.createLoremIpsumParagraph(80, 0.3)}</p>
                        <p>3- {Paprize.createLoremIpsumParagraph(80, 0.4)}</p>
                        <h4>Part 2</h4>
                        <p>1- end</p>
                    </PageContent>
                </Section>

                <Section
                    dimension={{ height: '600px', width: '400px' }}
                    margin={{
                        top: '10px',
                        right: '10px',
                        bottom: '10px',
                        left: '10px',
                    }}
                    config={{
                        plugins: [Paprize.debugPlugin, tocPlugin],
                    }}
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
                        <h4>Part 1 | 2</h4>
                        <p>1- {Paprize.createLoremIpsumParagraph(10, 0.5)}</p>
                        <PageBreak />
                        <h4>Part 2 | 2</h4>
                        <p>2- {Paprize.createLoremIpsumParagraph(100, 0.6)}</p>
                        <h5>Part 3 | 2</h5>
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
    const { pageNumber } = usePageInfo();
    const { totalPages } = useSectionInfo();
    return (
        <PageHeader>
            <h3>
                Page Header {pageNumber} of {totalPages}
            </h3>
        </PageHeader>
    );
}

function MyTOC({ contentList }: { contentList: SectionTocState[] }) {
    const { isFirstPaginationCompleted, sections } = useReportInfo();
    const { sectionId } = useSectionInfo();
    const { release } = useSectionSuspension(sectionId, true);

    useEffect(() => {
        const r = sections
            .filter((s) => s.sectionId !== sectionId && s.sectionId)
            .every((s) => s.isPaginated);

        if (r && isFirstPaginationCompleted) {
            release();
        }
    }, [release, isFirstPaginationCompleted, sections, sectionId]);

    return (
        <nav>
            <ul>
                {contentList.map((content) => (
                    <li key={content.sectionId + content.title}>
                        <a href={`#${content.sectionId}-${content.pageNumber}`}>
                            {content.sectionId}/{content.title}/{content.level}{' '}
                            --
                            {content.pageNumber}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
