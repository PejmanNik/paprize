---
title: Quick Start
---

import ComponentCatalog from '@site/src/components/ComponentCatalog';
import PageComponents from './\_page-components.md';

# React Quick Start

Get started by adding the `@paprize/react` library to your React project.

```bash
npm install @paprize/react
```

# Components

All components can be imported into your project from `@paprize/react`; This page lists all the components required to create a report.

Paprize components **must** be placed in specific positions within the component tree.
Using them outside of their expected structure will cause runtime errors.
Each component’s documentation explicitly specifies its valid parent and child components.
Paprize relies on this structure to correctly build the report.

When a component does not support dynamic height, **avoid** placing content inside it that could change its height between renders.
Dynamic height content can break the layout logic and cause pagination issues.

Any element whose height can vary between renders is considered dynamic height content.
For example, rendering a random quote that may contain 10–100 words could add or remove lines of text, causing the component’s height to change unexpectedly.

To prevent this, consider assigning a fixed height to such elements, reserving space for their content ahead of time.

## ReportRoot

This component must be used as the parent component for the report, and all other components must appear as its children. It acts as the internal state provider for the report system.

```
<ReportRoot>...</ReportRoot>
```

<ComponentCatalog.Container isMandatory />

## ReportView

This component is intended for use in Client-Side Pagination only. It applies default CSS styles to make the output resemble the Chrome Print Preview screen. [More info](/02-React/04-report-preview.md)

```
<ReportRoot>
    <ReportPreview>...</ReportPreview>
</ReportRoot>
```

<ComponentCatalog.Container>
<ComponentCatalog.Parent>[ReportRoot](#reportroot)</ComponentCatalog.Parent>
</ComponentCatalog.Container>

## Section

A report is divided into sections, and each section defines its own page formatting, including page numbers, headers, footers, orientation, size, and plugins.

Every report must contain at least one Section, and each Section must contain one [PageContent](#pagecontent)
.

```jsx
<Section
    margin={pageMargin.Narrow}
    dimension={pageSize.A4}
    orientation={'landscape'}
    config={globalConfig}
>
    ...
</Section>
```

<ComponentCatalog.Container isMandatory>
<ComponentCatalog.Parent>[ReportRoot](#reportroot)</ComponentCatalog.Parent>
<ComponentCatalog.Children>
<PageComponents />
</ComponentCatalog.Children>
</ComponentCatalog.Container>

### Props

| Name        | Type                                 | Is Required | Description                          |
| :---------- | :----------------------------------- | :---------: | :----------------------------------- |
| dimension   | PageDimension                        |     ✅      | Use `pageSize` for standard values   |
| margin      | PageMargin                           |     ❌      | Use `pageMargin` for standard values |
| orientation | PageOrientation                      |     ❌      | Default: `portrait`                  |
| config      | [PaginationConfig](../configuration) |     ❌      |                                      |

**pageMargin**: It will provide the Microsoft Word default margins  
**pageSize**: It will provide most of the ISO 216 (e.g. A4, B5) + North American Sizes pages sizes

### Types

| Name            | values                                                       | Description                                |
| :-------------- | :----------------------------------------------------------- | :----------------------------------------- |
| PageMargin      | `{top: string; right: string; bottom: string; left: string}` |
| PageDimension   | `{height: string; width: string}`                            | Height and width in `portrait` orientation |
| PageOrientation | 'portrait' \| 'landscape'                                    |                                            |

:::info

The string values in `PageMargin` and `PageDimension` must contain a number and an acceptable CSS unit, e.g. `300mm`

:::

## SectionHeader

This component is responsible for rendering the section header content. It is displayed at the top of the very first page of the section, before the `PageHeader`.

```jsx
<SectionHeader>section header</SectionHeader>
```

<ComponentCatalog.Container mustBeADirectChild hasFixedHight>
<ComponentCatalog.Parent>[Section](#section)</ComponentCatalog.Parent>
</ComponentCatalog.Container>

## SectionFooter

This component is responsible for rendering the section footer content. It is displayed at the bottom of the very last page of the section, after the `PageFooter`.

```jsx
<SectionFooter>section footer</SectionFooter>
```

<ComponentCatalog.Container mustBeADirectChild hasFixedHight>
<ComponentCatalog.Parent>[Section](#section)</ComponentCatalog.Parent>
</ComponentCatalog.Container>

## PageHeader

This component is responsible for rendering the page header content. It will automatically repeat at the top of every page.

```jsx
<PageHeader>page header</PageHeader>
```

<ComponentCatalog.Container mustBeADirectChild hasFixedHight>
<ComponentCatalog.Parent>[Section](#section)</ComponentCatalog.Parent>
</ComponentCatalog.Container>

## PageFooter

This component is responsible for rendering the page footer content. It will automatically repeat at the bottom of every page.

```jsx
<PageFooter>page footer</PageFooter>
```

<ComponentCatalog.Container mustBeADirectChild hasFixedHight>
<ComponentCatalog.Parent>[Section](#section)</ComponentCatalog.Parent>
</ComponentCatalog.Container>

## PageOverlay

This component provides an overlay for the page and will be rendered on every page. The children of this component are not paginated or processed by the pagination engine; they are rendered **on top of the pages** as an overlay.

```jsx
<PageOverlay>
    <div
        style={{
            position: 'absolute',
            zIndex: -1,
            top: '50%',
            transform: 'rotate(-90deg)',
        }}
    >
        Report watermark
    </div>
</PageOverlay>
```

<ComponentCatalog.Container mustBeADirectChild>
<ComponentCatalog.Parent>[Section](#section)</ComponentCatalog.Parent>
</ComponentCatalog.Container>

## PageContent

The PageContent component is the main container for your report content. Pagination and layout logic are applied to everything inside this component. after pagination is down this component is no longer .. TODO

```jsx
<PageContent> report content </PageContent>
```

<ComponentCatalog.Container isMandatory mustBeADirectChild>
<ComponentCatalog.Parent>[Section](#section)</ComponentCatalog.Parent>
</ComponentCatalog.Container>

:::info
All children of `PageContent` are subject to [ComponentSnapshot](/02-React/05-component-snapshot.md).
:::
