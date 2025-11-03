---
sidebar_position: 2
---

# Zero Config

Zero Config Report is a simple solution for organizing reports without writing any reporting code. It is available only for the server-side reporting solution and is ideal for simple reports where the full feature set of the Vanilla version isn’t needed.

1. Add [Report Components](/components/report-components.md) to your report.
1. Use [Page Info](/vanilla/page-info.md#attribute-based) elements to adjust the report content.
1. Use `@paprize/puppeteer` with the static HTML file of your report

```html title="report.html"
<div data-pz-preview>
    <div data-pz-section>
        <div data-pz-page-header>
            <h2>Page <span data-pz-v-page-number></span></h2>
        </div>

        <div data-pz-page-content>...</div>
    </div>
</div>
```

```ts title="script.ts"
import { reportToPdf } from '@paprize/puppeteer';
import { promises as fs } from 'fs';
import puppeteer, { type Browser } from 'puppeteer';

let browser!: Browser;

try {
    browser = await puppeteer.launch({ headless: true });

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
