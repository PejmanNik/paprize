---
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ComponentCatalog from '@site/src/components/ComponentCatalog';

# Layout Components

You can customize the report layout by using special layout components. These components give you fine grained control over pagination and element positioning.

## PageBreak

The PageBreak component forces a page break and pushes any subsequent content to the beginning of the next page in your document.

<Tabs>
<TabItem value="Vanilla" label="Vanilla | Zero">

```html
<div data-pz-page-break></div>
```

</TabItem>
<TabItem value="React">

```tsx
<PageBreak />
```

</TabItem>
</Tabs>

<br/>

<ComponentCatalog.Container noChildren>
<ComponentCatalog.Parent>[PageContent](report-components.md#page-content)</ComponentCatalog.Parent>
</ComponentCatalog.Container>

## Layout

The Layout component allows you to customize the pagination engine’s behavior for the element and its children.

The available values are described in [Configuration](/configuration.md).

<Tabs>
<TabItem value="Vanilla" label="Vanilla | Zero">

```html
<p
    data-pz-hyphen="-"
    data-pz-keep-on-same-page="true"
    data-pz-hyphenation-enabled="true"
>
    ...
</p>
```

</TabItem>
<TabItem value="React">

```jsx
<Layout hyphen={'-'} keepOnSamePage={true} hyphenationEnabled={true}>
    <p>...</p>
</Layout>
```

</TabItem>
</Tabs>

<ComponentCatalog.Container noChildren>
<ComponentCatalog.Parent>[PageContent](report-components.md#pagecontent)</ComponentCatalog.Parent>
</ComponentCatalog.Container>

All props/attributes are optional and follow this order of precedence:

1. Props defined on this component (highest priority)
1. Props inherited from the nearest parent component
1. Global configuration provided to [Section](report-components.md#section)
