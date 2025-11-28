---
sidebar_position: 1
---

# Vanilla Quick Start

Get started by adding the `@paprize/vanilla` library to your project.

```bash
npm install @paprize/vanilla
```

1. Add [Report Components](/components/report-components.md) to your report.
1. Create a `PaprizeReport` instance.
1. Add your sections to it.
1. Add [event listeners](/vanilla/page-info.md) to adjust the content after pagination
1. Schedule a pagination.

```html
<div data-pz-preview>
    <div data-pz-section id="section-1">...</div>
    <div data-pz-section id="section-2">...</div>
</div>

<script>
    import { pageSize, pageMargin } from '@paprize/core';
    import { PaprizeReport } from '@paprize/vanilla';

    const report = new PaprizeReport();

    await report.addSection({
        id: 'section-1',
        dimension: pageSize.A4,
        margin: pageMargin.Narrow,
        ...configs,
    });

    await report.addSection({
        id: 'section-2',
        dimension: pageSize.A5,
        margin: pageMargin.None,
        ...configs,
    });

    report.monitor.addEventListener('pageCompleted', (pageContext) => {
        if (pageContext.components.pageHeader) {
            pageContext.components.pageHeader.innerHTML = `<h4>Page ${pageContext.pageIndex + 1} of ${pageContext.totalPages}</h4>`;
        }
    });

    await r.schedulePagination();
</script>
```
