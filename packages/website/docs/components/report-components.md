---
sidebar_position: 1
---

import ComponentCatalog from '@site/src/components/ComponentCatalog';
import ComponentsDiagram from '@site/src/components/ComponentsDiagram';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import PageComponents from './\_page-components.md';

# Report Components

Reports are created by wrapping your logic, content, and layout within **Paprize** components.  
Unlike printing a standard web page where the browser manages pagination automatically but with limited control, **Paprize** gives you full control over how your content is paginated and laid out across pages.

<ComponentsDiagram />

Paprize components **must** be placed in specific positions within the component tree. Using them outside of their expected structure will cause runtime errors.
Each component’s documentation explicitly specifies its valid parent and child components.
Paprize relies on this structure to correctly build the report.

### Section

The fundamental building block of every report is the **Section**. A report is divided into sections, and each section defines its own page formatting, including page numbers, headers, footers, orientation, size, and plugins.

- Each report must contain **at least one** Section.
- A Section can define its own page size, headers, and footers.
- All other components are available only within a Section.
- Only one instance of each component type can exist per Section.
- All components are optional except **Page Content**. In other words every Section must contain **exactly one** Page Content component.

<Tabs>
<TabItem value="Vanilla">

Provide [SectionOptions](/core/api.md#sectionoptions) to the `addSection` method. Some of these options can be customized per element using the [Layout Component](layout-components.md#layout).

For more advanced and fine grained customization, you can use [Plugins](/plugin.md).

```html
<div data-pz-section id="section-1">...</div>

<script>
    const report = new PaprizeReport();
    report.addSection({
        id: 'section-1',
        dimension: pageSize.A4,
        margin: pageMargin.Narrow,
        ...configs,
    });
</script>
```

<ComponentCatalog.Container isMandatory>
<ComponentCatalog.Children>
<PageComponents />
</ComponentCatalog.Children>
</ComponentCatalog.Container>

</TabItem>
<TabItem value="Zero">

- Page Size: use one of the [pageSize](/core/api.md#pagesize-1), including A1-6
- Page Margin: use one the [pageMargin](/core/api.md#pagemargin-1) include `none`

```html
<div
    data-pz-section
    data-pz-section-page-size="A4"
    data-pz-section-page-margin="narrow"
>
    ...
</div>
```

<ComponentCatalog.Container isMandatory>
<ComponentCatalog.Children>
<PageComponents />
</ComponentCatalog.Children>
</ComponentCatalog.Container>

</TabItem>
<TabItem value="React">

Provide [SectionProps](/react/api.md#sectionprops) to the `Section` component. Some of these options can be customized per element using the [Layout Component](layout-components.md#layout).

For more advanced and fine grained customization, you can use [Plugins](/plugin.md).

```tsx
<Section
    margin={pageMargin.Narrow}
    dimension={pageSize.A4}
    orientation={'landscape'}
    {...configs}
>
    ...
</Section>
```

<ComponentCatalog.Container isMandatory>
<ComponentCatalog.Parent>[ReportRoot](/react/components.md#report-root)</ComponentCatalog.Parent>
<ComponentCatalog.Children>
<PageComponents />
</ComponentCatalog.Children>
</ComponentCatalog.Container>

</TabItem>
</Tabs>

<br/>

### Section Header

Appears at the start of a Section. It is rendered **only on the first page** of the Section.

<Tabs>
<TabItem value="Vanilla" label="Vanilla | Zero">

```html
<div data-pz-section-header>...</div>
```

</TabItem>
<TabItem value="React">

```tsx
<SectionHeader>...</SectionHeader>
```

</TabItem>
</Tabs>

<ComponentCatalog.Container mustBeADirectChild>
<ComponentCatalog.Parent>[Section](#section)</ComponentCatalog.Parent>
</ComponentCatalog.Container>

<br/>

### Page Header

Appears at the start of **each page**.

- If a Section Header is present, the Page Header on the first page will appear **after** the Section Header.

<Tabs>
<TabItem value="Vanilla" label="Vanilla | Zero">

```html
<div data-pz-page-header>...</div>
```

</TabItem>
<TabItem value="React">

```tsx
<PageHeader>...</PageHeader>
```

</TabItem>
</Tabs>

<ComponentCatalog.Container mustBeADirectChild>
<ComponentCatalog.Parent>[Section](#section)</ComponentCatalog.Parent>
</ComponentCatalog.Container>

<br/>

### Page Content

Contains the main content of the report.

- This component is required within the section.
- The pagination engine runs only on this component.
- Content is split across pages based on the Section’s page size, headers, and footers.
- Pagination is performed on cloned DOM elements. The original DOM elements or React components and their state will be discarded after pagination.

<Tabs>
<TabItem value="Vanilla" label="Vanilla | Zero">

```html
<div data-pz-page-content>...</div>
```

</TabItem>
<TabItem value="React">

```tsx
<PageContent>...</PageContent>
```

</TabItem>
</Tabs>

<ComponentCatalog.Container mustBeADirectChild>
<ComponentCatalog.Parent>[Section](#section)</ComponentCatalog.Parent>
</ComponentCatalog.Container>

<br/>

### Page Overlay

Adds extra content **on top of or behind** each page.

- Common use cases include watermarking or placing fixed elements (e.g., live inputs) at specific positions.
- Overlays are **not paginated**, so handling possible collisions is the responsibility of the user.

<Tabs>
<TabItem value="Vanilla" label="Vanilla | Zero">

```html
<div data-pz-page-overlay>
    <div
        style="
                position: absolute;
                z-index: -1;
                top: 50%;
                transform: rotate(-90deg);
            "
    >
        watermark
    </div>
</div>
```

</TabItem>
<TabItem value="React">

```tsx
<PageOverlay>
    <div
        style={{
            position: 'absolute',
            zIndex: -1,
            top: '50%',
            transform: 'rotate(-90deg)',
        }}
    >
        watermark
    </div>
</PageOverlay>
```

</TabItem>
</Tabs>

<ComponentCatalog.Container mustBeADirectChild>
<ComponentCatalog.Parent>[Section](#section)</ComponentCatalog.Parent>
</ComponentCatalog.Container>

<br/>

### Page Footer

Appears at the end of **each page**.

- If a Section Footer is present, the Page Footer on the last page will appear **before** the Section Footer.

<Tabs>
<TabItem value="Vanilla" label="Vanilla | Zero">

```html
<div data-pz-page-footer>...</div>
```

</TabItem>
<TabItem value="React">

```tsx
<PageFooter>...</PageFooter>
```

</TabItem>
</Tabs>

<ComponentCatalog.Container mustBeADirectChild>
<ComponentCatalog.Parent>[Section](#section)</ComponentCatalog.Parent>
</ComponentCatalog.Container>

<br/>

### Section Footer

Appears at the end of a Section. It is rendered **only on the last page** of the Section.

<Tabs>
<TabItem value="Vanilla" label="Vanilla | Zero">

```html
<div data-pz-section-footer>...</div>
```

</TabItem>
<TabItem value="React">

```tsx
<SectionFooter>...</SectionFooter>
```

</TabItem>
</Tabs>

<ComponentCatalog.Container mustBeADirectChild>
<ComponentCatalog.Parent>[Section](#section)</ComponentCatalog.Parent>
</ComponentCatalog.Container>
