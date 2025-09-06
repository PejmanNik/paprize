export const paprize_isReady = '__paprize_is_ready';
export const paprize_readJsonDataFile = '__paprize_read_json_data_file';

declare global {
    interface Window {
        [paprize_isReady]?: boolean;
        [paprize_readJsonDataFile]?: () => Promise<string>;
    }
}
