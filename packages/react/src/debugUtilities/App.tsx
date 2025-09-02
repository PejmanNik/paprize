import { useEffect } from 'react';
import { DevTools } from 'jotai-devtools';
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

export default function App() {
    //enableDebugMode();
    Paprize.logger.setLevel('debug', false);

    return (
        <ReportRoot>
            <DevTools />
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
                        <h1>Section Header</h1>
                    </SectionHeader>
                    <PageHeader>
                        <MyPageHeader />
                    </PageHeader>
                    <PageFooter>This is a footer</PageFooter>
                    <SectionFooter>Section Footer</SectionFooter>
                    <PageContent>
                        <p>{Paprize.createLoremIpsumParagraph(10, 0.2)}</p>
                        <p>{Paprize.createLoremIpsumParagraph(80, 0.3)}</p>
                        <p>{Paprize.createLoremIpsumParagraph(100, 0.4)}</p>
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
                        <p>{Paprize.createLoremIpsumParagraph(10, 0.5)}</p>
                        <PageBreak />
                        <p>{Paprize.createLoremIpsumParagraph(100, 0.5)}</p>

                        <Layout keepOnSamePage={false}>
                            <p style={{ border: '1px solid black' }}>
                                {Paprize.createLoremIpsumParagraph(100, 0.5)}
                            </p>
                        </Layout>
                        <p>{Paprize.createLoremIpsumParagraph(200, 0.6)}</p>
                        <p>{Paprize.createLoremIpsumParagraph(100, 0.1)}</p>
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
            <h1>
                Page Header {pageNumber} of {totalPages}
            </h1>
        </PageHeader>
    );
}

function MyTOC() {
    const { sections } = useReportInfo();
    const { name } = useSectionInfo();
    const { release } = useSectionSuspension(name);

    useEffect(() => {
        if (sections.length > 0) {
            release();
        }
    }, [release, sections.length]);

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
