---
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ComponentCatalog from '@site/src/components/ComponentCatalog';

# Report Preview

This component is intended for use in [client-side report generation](/report-generation.md). It applies default CSS styles to make the output resemble the Chrome Print Preview screen.

![Sample Report](/img/sample-report-1.png)

The preview component must wrap all sections in the report.

<Tabs>
<TabItem value="Vanilla">

```html
<div data-pz-preview>
    <div data-pz-section ...>...</div>
    <div data-pz-section ...>...</div>
</div>
```

<ComponentCatalog.Container>
<ComponentCatalog.Children>[Section](report-components.md#section)</ComponentCatalog.Children>
</ComponentCatalog.Container>

</TabItem>
<TabItem value="React">

```tsx
<ReportRoot>
    <ReportPreview>...</ReportPreview>
</ReportRoot>
```

<ComponentCatalog.Container>
<ComponentCatalog.Parent>[ReportRoot](/react/components.md#report-root)</ComponentCatalog.Parent>
<ComponentCatalog.Children>[Section](report-components.md#section)</ComponentCatalog.Children>
</ComponentCatalog.Container>

</TabItem>
</Tabs>

<br/>

:::info
Since you don’t have control over the client’s browser, user extensions may inject extra elements into the page and cause issues when printing. The Report Preview component ensures a clean output by hiding all non-Paprize elements during print.
:::

## Styling

You can customize it by changing the CSS variables or by creating your own styling component.

```css
--paprize-page-background-color: #ffffff;
--paprize-page-margin-bottom: 10px;
--paprize-page-box-shadow: rgb(142 138 138) -1px 3px 5px 2px;
--paprize-section-margin-bottom: 10px;
--paprize-preview-background-color: rgb(218 220 224);
--paprize-preview-padding: 30px 10px;
```

When creating custom styles, ensure they are applied only to screens by using `screen` CSS media query. The available class names include:

```css
@media screen {
    .paprize-preview {
    }
    .paprize-page {
    }
    .paprize-section {
    }
}
```
