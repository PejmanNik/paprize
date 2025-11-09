import { promises as fs } from 'fs';
import { reportToPdf } from '@paprize/puppeteer';
import puppeteer, { type Browser } from 'puppeteer';

let browser!: Browser;

try {
    browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-web-security',
        ],
    });

    const page = await browser.newPage();

    const pdf = await reportToPdf(
        page,
        new URL(`file://${import.meta.dirname}/index.html`),
        {
            info: {
                name: 'Mike',
                lastName: 'Ross',
                age: 24,
            },
        }
    );

    await fs.writeFile('index.pdf', pdf);
} finally {
    await browser.close();
}
