import { useEffect } from 'react';
import * as Paprize from '@paprize/core/src';

import {
    ReportView,
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
import 'jotai-devtools/styles.css';
import { useJsonData } from '../components/useJsonData';

export default function App() {
    //enableDebugMode();
    Paprize.logger.setLevel('debug', false);
    return (
        <ReportRoot>
            <input type="checkbox" id="debug" />
            {/* <DevTools /> */}
            <ReportView>
                <Section
                    name={'section-1'}
                    dimension={{ height: '300px', width: '400px' }}
                    margin={{
                        top: '10px',
                        right: '10px',
                        bottom: '10px',
                        left: '10px',
                    }}
                >
                    <PageContent>
                        <MyTOC />
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
                        <p>1- {Paprize.createLoremIpsumParagraph(20, 0.2)}</p>
                        <p>2- {Paprize.createLoremIpsumParagraph(80, 0.3)}</p>
                        <p>2- {Paprize.createLoremIpsumParagraph(80, 0.4)}</p>
                        <MyContent />
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
                >
                    <SectionHeader>
                        <h1>Section 2 Header</h1>
                    </SectionHeader>
                    <PageHeader>
                        <h2>Page 2 Header</h2>
                    </PageHeader>
                    <PageFooter>This is a footer 2</PageFooter>
                    <SectionFooter>Section 2 Footer</SectionFooter>
                    <PageContent>
                        <p>1- {Paprize.createLoremIpsumParagraph(10, 0.5)}</p>
                        <PageBreak />
                        <p>2- {Paprize.createLoremIpsumParagraph(100, 0.6)}</p>

                        <Layout keepOnSamePage={false}>
                            <p style={{ border: '1px solid black' }}>
                                3- {Paprize.createLoremIpsumParagraph(100, 0.8)}
                            </p>
                        </Layout>
                        <p>4- {Paprize.createLoremIpsumParagraph(200, 0.9)}</p>
                        <p>5- {Paprize.createLoremIpsumParagraph(100, 0.1)}</p>
                    </PageContent>
                </Section>
            </ReportView>
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

function MyTOC() {
    const { isFirstPaginationCompleted, sections } = useReportInfo();
    const { sectionName } = useSectionInfo();
    const { release } = useSectionSuspension(sectionName);

    useEffect(() => {
        if (isFirstPaginationCompleted) {
            release();
        }
    }, [release, isFirstPaginationCompleted]);

    return (
        <nav>
            <ul>
                {sections.map((section) => (
                    <li key={section.sectionName}>{section.sectionName}</li>
                ))}
            </ul>
        </nav>
    );
}

function MyContent() {
    const data = useJsonData();
    console.log('xxx', data);
    return (
        <div>
            <h1>Data from JSON file:</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}
