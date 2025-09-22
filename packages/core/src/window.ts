export const paprize_isReady = '__PAPRIZE_IS_READY';
export const paprize_readJsonDataFile = '__PAPRIZE_READ_JSON_DATA_FILE';

declare global {
    interface Window {
        [paprize_isReady]?: boolean;
        [paprize_readJsonDataFile]?: () => Promise<string>;
    }
}
