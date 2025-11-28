import clsx from 'clsx';
import styles from './index.module.css';
import Highlight from '@site/static/img/highlight.svg';
import Page from '@site/static/img/page.svg';
import PaginatedPage from '@site/static/img/paginatedPage.svg';
import ArrowHorizontal from '@site/static/img/arrowHorizontal.svg';
import ArrowVertical from '@site/static/img/arrowVertical.svg';
import { SampleCode } from './SampleCode';

export function Features({ children }: { children: React.ReactNode }) {
    return (
        <div className={clsx(styles.feature, styles.paperGrid)}>{children}</div>
    );
}

export function FeatureContent() {
    return (
        <main className={styles.featureSection}>
            <div className={styles.featureDividerParent}>
                <div className={styles.featureDivider} />
            </div>
            <Features>
                <h3 className={styles.featureTitle}>
                    How It Works?
                    <Highlight className={styles.featureHighlight} />
                </h3>
                <div className={styles.featureFlow}>
                    <div className={clsx(styles.featureStep, styles.codeBlock)}>
                        <p>
                            Define your report's header, footer, and content
                            while using the full power of JavaScript and CSS to
                            style it. Paprize seamlessly paginates your web
                            page, transforming it into a beautiful,
                            professional, print-ready report.
                        </p>
                        <SampleCode className={styles.sampleCode} />
                        <ArrowHorizontal className={styles.flowArrow} />
                        <ArrowVertical className={styles.flowArrowMobile} />
                    </div>
                    <div className={styles.featureStep}>
                        <Page
                            height={'100%'}
                            className={styles.featureIllustration}
                        />
                        <ArrowHorizontal className={styles.flowArrow} />
                        <ArrowVertical className={styles.flowArrowMobile} />
                    </div>
                    <div className={styles.featureStep}>
                        <PaginatedPage
                            height={'100%'}
                            className={styles.featureIllustration}
                        />
                    </div>
                </div>
            </Features>
        </main>
    );
}
