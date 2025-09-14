import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import LandingPage from '@site/src/components/LandingPage';
import Layout from '../theme/Layout';

export default function HomePage() {
    const { siteConfig } = useDocusaurusContext();

    return (
        <Layout
            title={siteConfig.title}
            description={siteConfig.tagline}
            noNavbar={true}
            noFooter={true}
        >
            <LandingPage />
        </Layout>
    );
}
