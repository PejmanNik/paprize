---
sidebar_position: 1
---

# Puppeteer Quick Start

Get started by adding the `@paprize/puppeteer` library to your project.

```bash
npm install @paprize/puppeteer
```

:::warning

This is a back-end only library and can be used exclusively in server-side applications.

:::

## Prepare Your Report

The first step is to prepare your report file.  
If you are using React or a more complex project setup, you need to build your project so it can be served.

## Serve Report

Use the `serveReport` function to create a local HTTP server for your reports.

- `serveReport` accepts the directory of your built assets (JS + HTML)
- You can also provide an optional port number to serve it on.

## Convert to PDF

The final step requires an instance of [Puppeteer](https://pptr.dev). After installing and setting it up in your environment, Create a new `Page` in Puppeteer and pass that page instance to the `reportToPdf` function to generate the PDF.

```ts
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
```
