import {
    ReportRoot,
    ReportPreview,
    Section,
    PageContent,
    PageHeader,
    PageFooter,
    PageOverlay,
} from '@paprize/react';
import Cover from './Cover';
import Header from './Header';
import Finance from './Finance';
import Business from './Business';
import Footer from './Footer';
import PageBar from './PageBar';
import { pageSize } from '@paprize/core';
import './styles.css';

function App() {
    return (
        <ReportRoot>
            <ReportPreview>
                <Section size={pageSize.A4}>
                    <PageContent>
                        <Cover />
                    </PageContent>
                </Section>

                <Section size={pageSize.A4}>
                    <PageHeader>
                        <Header />
                    </PageHeader>

                    <PageContent>
                        <Finance />
                        <Business />
                    </PageContent>

                    <PageFooter>
                        <Footer />
                    </PageFooter>

                    <PageOverlay>
                        <PageBar />
                    </PageOverlay>
                </Section>
            </ReportPreview>
        </ReportRoot>
    );
}

export default App;
