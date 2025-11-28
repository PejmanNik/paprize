---
sidebar_position: 3
---

import ComponentCatalog from "@site/src/components/ComponentCatalog";
import PageComponents from '../components/\_page-components.md';

# Page Info

Pagination information is provided through several hooks, as the data becomes available at different stages of React’s rendering and pagination lifecycle.

Using these hooks may cause the page to re-render, which can trigger the pagination engine to run again. To avoid an infinite loop, consider using [Layout Suspension](section-suspension.md) to pause the pagination engine for a specific section until all required data is available.

## usePageInfo

Gets the [current page info](api.md#pageinfo) within the current section.

```jsx
const { pageIndex, totalPages } = usePageInfo();
```

<ComponentCatalog.Container noChildren>
<ComponentCatalog.Parent>
<PageComponents />
</ComponentCatalog.Parent>
</ComponentCatalog.Container>

## useSectionInfo

Get information about the [current section and its pages](api.md#sectioninfo).

```jsx
const { sectionId } : SectionInfo = useSectionInfo();
```

<ComponentCatalog.Container noChildren>
<ComponentCatalog.Parent>[Section](/components/report-components.md#section)</ComponentCatalog.Parent>
</ComponentCatalog.Container>

## useReportInfo

Retrieves information about [all sections within the report](api.md#reportinfo).

```jsx
const { sections } = useReportInfo();
```

<ComponentCatalog.Container noChildren>
<ComponentCatalog.Parent>[ReportRoot](/react/components.md#report-root)</ComponentCatalog.Parent>
</ComponentCatalog.Container>
