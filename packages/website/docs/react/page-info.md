---
sidebar_position: 3
---

import ComponentCatalog from "@site/src/components/ComponentCatalog";
import PageComponents from '../components/\_page-components.md';

# Page Info

Pagination information is provided through several hooks, as the data becomes available at different stages of React’s rendering and pagination lifecycle.

Using these hooks may cause the page to re-render, which can trigger the pagination engine to run again. To avoid an infinite loop, consider using [Layout Suspension](/react/section-suspension.md) to pause the pagination engine for a specific section until all required data is available.

## usePageInfo

Gets the current page info within the current section, starting from 0.

```jsx
const { pageIndex, totalPages } = usePageInfo();
```

| Name       | Type   | Description                           |
| :--------- | :----- | :------------------------------------ |
| pageIndex  | number | Index of the page within the section. |
| totalPages | number | Total number of pages in the section. |

<ComponentCatalog.Container noChildren>
<ComponentCatalog.Parent>
<PageComponents />
</ComponentCatalog.Parent>
</ComponentCatalog.Container>

## useSectionInfo

Get information about the current section and its pages.

```jsx
const { sectionId } : SectionInfo = useSectionInfo();
```

<ComponentCatalog.Container noChildren>
<ComponentCatalog.Parent>[Section](/components/report-components.md#section)</ComponentCatalog.Parent>
</ComponentCatalog.Container>

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

<ComponentCatalog.Container noChildren>
<ComponentCatalog.Parent>[ReportRoot](/react/components.md#report-root)</ComponentCatalog.Parent>
</ComponentCatalog.Container>

| Name     | Type          | Description                                                                    |
| :------- | :------------ | :----------------------------------------------------------------------------- |
| sections | SectionInfo[] | An array of sections in the report, each containing details about the section. |
