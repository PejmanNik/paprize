---
sidebar_position: 3
---

import ComponentCatalog from "@site/src/components/ComponentCatalog";
import PageComponents from '../components/\_page-components.md';

# Page Info

By using the `monitor` property from `PaprizeReport`, you can subscribe to pagination [events](vanilla/api.md#paprizereportevents) and update the report content with the corresponding page information.

:::warning
Be cautious when modifying element`s content within these events, as the changes are applied **after pagination**. Altering the content may affect the page height and break the page size boundaries.

To prevent this, consider assigning a fixed height to such elements, reserving space for their content ahead of time.
:::

## PageCompleted

Triggered after pagination is completed for each page. This event provides the page information and is fired once per page in each pagination cycle.

- Event Name: `pageCompleted`
- Event Object: [DomPageContext](vanilla/api.md#dompagecontext)

Example usage:

```tsx
const report = new PaprizeReport();
report.monitor.addEventListener('pageCompleted', (pageContext) => {
    if (pageContext.pageHeader) {
        pageContext.pageHeader.innerHTML = `<h4>Page Header ${pageContext.index + 1} of ${pageContext.totalPages}</h4>`;
    }
});
```

## SectionCompleted

Triggered when a section has been fully paginated. This event provides the section information and is fired once per report in each pagination cycle.

- Event Name: `sectionCompleted`
- Event Object: [DomSectionContext](vanilla/api.md#domsectioncontext)

## PaginationCycleCompleted

Triggered when an entire pagination cycle is completed. This event provides information about all paginated sections and is fired at least once after scheduling the pagination.

If a suspended section becomes unsuspend, this event will be triggered again, since the previous cycle did not include that section.

- Event Name: `paginationCycleCompleted`
- Event Object: [PaginationCycleCompleted](vanilla/api.md#dompaginationcyclecompleted)

## Attribute Based

For simple use cases or when using [Zero Config](/puppeteer/zero-config.md), you can use attribute-based page info. The content of elements with specific attributes will be replaced with the corresponding values after pagination.

- **Current Page Number:** `data-pz-v-page-number`
- **Total Number of Pages:** `data-pz-v-total-pages`
- **Current Section Number:** `data-pz-v-section-number`
- **Total Number of Sections:** `data-pz-v-total-sections`

<br/>

For example:

```html
<span data-pz-v-total-pages></span>
```

If the current section has 10 pages, after pagination it will be converted to:

```html
<span data-pz-v-total-pages>10</span>
```
