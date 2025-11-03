---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Puppeteer Quick Start

Get started by adding the `@paprize/puppeteer` library to your project.

```bash
npm install @paprize/puppeteer
```

This library requires an instance of [Puppeteer](https://pptr.dev). After installing and setting up the appropriate version of Puppeteer or Puppeteer Core in your environment, you can use it to export your report as a PDF, image, or HTML file.

:::warning

This is a back-end only library and can be used exclusively in server-side applications.

:::

<Tabs>
<TabItem value="Vanilla" label="Vanilla | Zero">

1. Setup the report HTML file
1. Add [Report Components](/components/report-components.md) to your report.
1. Convert report HTML file to PDF

```ts title="script.ts"
import { reportToPdf } from '@paprize/puppeteer';
import { promises as fs } from 'fs';
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
        new URL(`file://${import.meta.dirname}/report.html`)
    );

    await fs.writeFile('report.pdf', pdf);
} finally {
    await browser.close();
}
```

</TabItem>
<TabItem value="React">

1. Add [Report Components](/components/report-components.md) to your report.
1. Build your React app assets (JavaScript and HTML).
1. Serve the React app using a local HTTP server.
1. Convert the rendered React report into a PDF file.

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

</TabItem>
</Tabs>
