import styles from './index.module.css';

export function Footer() {
    return (
        <footer className={styles.footer}>
            <p className={styles.footerContent}>
                <strong>Paprize</strong> © {new Date().getFullYear()}
            </p>
        </footer>
    );
}
