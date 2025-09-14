import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '../theme/Layout';
import { Hero } from './Hero';
import { FeatureContent } from './Features';
import { Footer } from './Footer';

export default function HomePage() {
    const { siteConfig } = useDocusaurusContext();

    return (
        <Layout
            title={siteConfig.title}
            description={siteConfig.tagline}
            noNavbar={true}
            noFooter={true}
        >
            <Hero />
            <FeatureContent />
            <Footer />
        </Layout>
    );
}
