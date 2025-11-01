---
sidebar_position: 3
---

import ComponentCatalog from "@site/src/components/ComponentCatalog";
import PageComponents from '../components/\_page-components.md';

# Page Info

## PageCompleted

Gets the current page info within the current section, starting from 0.

- Event Name: `pageCompleted`
- Event Object: `pageContext: PageContext`

### PageContext

| Name       | Type              | Description                                 |
| :--------- | :---------------- | :------------------------------------------ |
| sectionId  | number            | Index of the section within the report.     |
| pageIndex  | number            | Index of the page within the section.       |
| totalPages | number            | Total number of pages in the section.       |
| page       | HTMLElement       | pagination result DOM element               |
| components | SectionComponents | pagination result DOM elements of component |

================
//////

```tsx
const report = new PaprizeReport();
report.monitor.addEventListener('pageCompleted', (pageContext) => {
    if (pageContext.pageHeader) {
        pageContext.pageHeader.innerHTML = `<h4>Page Header ${pageContext.index + 1} of ${pageContext.totalPages}</h4>`;
    }
});
```

## useSectionInfo

Get information about the current section and its pages.

```jsx
const { sectionId } : SectionInfo = useSectionInfo();
```

| Name         | Type       | Description                                                                       |
| :----------- | :--------- | :-------------------------------------------------------------------------------- |
| sectionId    | string     | Unique ID of the section.                                                         |
| sectionIndex | number     | Index of the section within the report.                                           |
| pages        | PageInfo[] | Array of pages in the section. When `isPaginated` is `false`, this will be empty. |
| isPaginated  | boolean    | Indicates whether the section has been paginated.                                 |
| isSuspended  | boolean    | Indicates whether there are pending suspensions in the section.                   |

## useReportInfo

Retrieves information about all sections within the report.

```jsx
const { sections } = useReportInfo();
```

| Name     | Type          | Description                                                                    |
| :------- | :------------ | :----------------------------------------------------------------------------- |
| sections | SectionInfo[] | An array of sections in the report, each containing details about the section. |

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
