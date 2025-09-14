import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Heading from '@theme/Heading';
import styles from './index.module.css';

export function Hero() {
    const { siteConfig } = useDocusaurusContext();

    return (
        <header className={clsx('hero', styles.heroBanner, styles.paperGrid)}>
            <div className={styles.layoutContainer}>
                <Heading as="h1" className={styles.heroTitle}>
                    {siteConfig.title}
                </Heading>
                <Heading as="h2" className={styles.heroTagline}>
                    {siteConfig.tagline}
                </Heading>
                <div className={styles.buttonContainer}>
                    <Link
                        className={clsx(
                            'button button--secondary button--lg',
                            styles.primaryButton
                        )}
                        to="/docs/getting-started"
                    >
                        GET STARTED
                    </Link>
                    <Link
                        className={clsx(
                            'button button--lg',
                            styles.secondaryButton
                        )}
                        to="https://github.com/PejmanNik/paprize"
                    >
                        GITHUB
                    </Link>
                </div>
            </div>
        </header>
    );
}
