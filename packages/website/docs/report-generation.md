---
sidebar_position: 3
---

# Report Generation

Reports can be generated in both **front-end** and **back-end** applications.

- **Front-end applications**  
  In front-end apps, the paginated report is rendered as a normal web page. Users can leverage the browser’s built in capabilities to save the report in formats such as **PDF** or **HTML**.  
  This means that simply by using Paprize in your front-end application, you can provide print-ready reports.
    - 🟢 Fast
    - 🟢 Easy
    - 🔴 Cannot directly create output in PDF or HTML format

- **Back-end applications**  
  For server-side report generation, use the `@paprize/puppeteer` package. documentation is available in [Paprize Puppeteer](/puppeteer/quick-start.md).
  This package is a thin wrapper around the [Puppeteer](https://pptr.dev) project. It launches a headless browser instance, loads your report, and saves it in the desired format for you.
    - 🟢 Directly create output in PDF or HTML format
    - 🔴 Requires Puppeteer, which is more resource and time consuming
