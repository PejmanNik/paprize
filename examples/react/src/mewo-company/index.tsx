import {
    ReportRoot,
    ReportPreview,
    Section,
    PageContent,
    pageSize,
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
import './styles.css';

function MewoCompany() {
    return (
        <ReportRoot>
            <ReportPreview>
                <Section dimension={pageSize.A4}>
                    <PageContent>
                        <Cover />
                    </PageContent>
                </Section>

                <Section dimension={pageSize.A4}>
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

export default MewoCompany;
