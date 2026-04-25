declare global {
    interface Window {
        runZeroReport: () => Promise<void>;
    }
}
