import { promises as fs } from 'fs';
import { serveReport, reportToPdf } from '@paprize/puppeteer';
import puppeteer, { type Browser } from 'puppeteer';

let browser!: Browser;
let server!: Awaited<ReturnType<typeof serveReport>>;

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

    server = await serveReport('dist');

    const page = await browser.newPage();

    const pdf = await reportToPdf(
        page,
        new URL('mewo-company', server.getHost())
    );

    await fs.writeFile('mewo-company.pdf', pdf);
} finally {
    await browser.close();
    server.close();
}
