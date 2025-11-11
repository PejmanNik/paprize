import { logger } from '@paprize/core';
import type { Page } from 'puppeteer-core';

export function setupLogger(page: Page) {
    page.on('console', (msg) => {
        const type = msg.type();
        const text = msg.text();

        switch (type) {
            case 'error':
                logger.error(`[browser] ${text}`);
                break;
            case 'warn':
                logger.warn(`[browser] ${text}`);
                break;
            case 'debug':
                logger.debug(`[browser] ${text}`);
                break;
            case 'info':
                logger.info(`[browser] ${text}`);
                break;
            default:
                logger.log(`[browser] ${text}`);
        }
    });
}
