import { logger } from '@paprize/core';
import type { Page } from 'puppeteer-core';

export function setupLogger(page: Page) {
    page.on('console', (msg) => {
        const type = msg.type();
        const text = msg.text();

        switch (type) {
            case 'error':
                logger.error(`error: ${text}`);
                break;
            case 'warn':
                logger.warn(`warn: ${text}`);
                break;
            case 'debug':
                logger.debug(`debug: ${text}`);
                break;
            case 'info':
                logger.info(`info: ${text}`);
                break;
            default:
                logger.log(`log: ${text}`);
        }
    });
}
