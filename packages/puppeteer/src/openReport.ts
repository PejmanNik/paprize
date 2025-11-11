import type { Page } from 'puppeteer-core';
import {
    logger,
    paprize_isInitialized,
    paprize_isReady,
    paprize_readJsonDataFile,
} from '@paprize/core';
import { setupLogger } from './setupLogger';

/**
 * Opens a report in the given Puppeteer page, injects a JSON data file if provided,
 * and waits for the report to be ready.
 *
 * @param page - The Puppeteer `Page` instance where the report will be opened.
 * @param reportUrl - The URL of the report to be opened.
 * @param jsonData - Optional JSON data to be injected into the page.
 * @param timeout - The maximum time to wait for the report to be ready, in milliseconds. Defaults to 30,000 ms.
 * @returns A promise that resolves when the report is ready.
 * @throws Will throw an error if the report does not become ready within the specified timeout.
 */
export async function openReport(
    page: Page,
    reportUrl: URL,
    jsonData: unknown | undefined,
    timeout: number = 30000
): Promise<void> {
    setupLogger(page);

    const jsonDataStr = jsonData ? JSON.stringify(jsonData) : null;
    await page.exposeFunction(paprize_readJsonDataFile, () => {
        return jsonDataStr;
    });

    await page.goto(reportUrl.toString(), {
        waitUntil: 'networkidle0',
        timeout,
    });

    await page
        .waitForFunction(`window.${paprize_isInitialized} === true`, {
            timeout: 100,
        })
        .catch(() => {
            logger.warn(
                'The page is not a valid paprize report. Using paprize fallback zero report.'
            );

            return page.addScriptTag({
                type: 'module',
                path: `${import.meta.dirname}/paprize-zero.js`,
            });
        });

    await page
        .waitForFunction(`window.${paprize_isReady} === true`, {
            timeout,
        })
        .catch(() => {
            throw new Error(
                'The report did not become ready within the specified timeout.'
            );
        });
}
