import ComponentCatalog from "@site/src/components/ComponentCatalog";
import PageComponents from './\_page-components.md';

# Page Info

Pagination information is provided through several different hooks, as the data becomes available at various stages of React’s rendering lifecycle. Using these hooks can cause the page to re-render, which may in turn trigger the pagination engine to run again.

## usePageInfo

Gets the current page number within the current section, starting from 1.

```jsx
const { pageNumber, totalPages } = usePageInfo();
```

<ComponentCatalog.Container isHook>
<ComponentCatalog.Parent>
<PageComponents />
</ComponentCatalog.Parent>
</ComponentCatalog.Container>

## useSectionInfo

Gets the total number of pages within the current section.

```jsx
const { sectionName, totalPages, isPaginated, pendingSuspensions } : SectionInfo = useSectionInfo();
```

<ComponentCatalog.Container isHook>
<ComponentCatalog.Parent>[Section](/02-React/01-quick-start.md#section)</ComponentCatalog.Parent>
</ComponentCatalog.Container>

| Name               | Type   | Description                                                                           |
| :----------------- | :----- | :------------------------------------------------------------------------------------ |
| sectionName        | string | unique name of current section.                                                       |
| totalPages         | number | The total number of pages in the section. When isPaginated is false, this value is 0. |
| isPaginated        | bool   | Indicates whether the section is paginated.                                           |
| pendingSuspensions | number | The number of pending suspensions in the section.                                     |

## useReportInfo

Retrieves information about all sections within the report. To use this as part of the [PageContent](/02-React/01-quick-start.md#pagecontent), you need to use [Layout Suspension](/02-React/06-section-suspension.md). You can learn more about this in the `PageContent`.

```jsx
const { sections, isPaginated, totalPages, isFirstPaginationCompleted } =
    useReportInfo();
```

<ComponentCatalog.Container isHook>
<ComponentCatalog.Parent>[ReportRoot](./quick-start/#reportroot)</ComponentCatalog.Parent>
</ComponentCatalog.Container>

| Name                       | Type          | Description                                                                                                                                                                 |
| :------------------------- | :------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| sections                   | SectionInfo[] | An array of sections in the report, each containing details about the section.                                                                                              |
| totalPages                 | number        | The total number of pages in the report. When isFirstPaginationCompleted is false, this value is 0. When isPaginated is false, this value is not guaranteed to be accurate. |
| isPaginated                | bool          | Indicates whether the report is ready and all sections are paginated.                                                                                                       |
| isFirstPaginationCompleted | bool          | Indicates whether the first pagination process has been completed. This becomes true once at least one section has been paginated.                                          |
