import ComponentCatalog from '@site/src/components/ComponentCatalog';

# Layout Components

You can customize the report layout by using special layout components. These components give you fine grained control over pagination and element positioning.

The following components are available:

## PageBreak

The PageBreak component forces a new page break and pushes any subsequent content to the beginning of the next page in your document.

```jsx
<PageBreak />
```

<ComponentCatalog.Container isHook>
<ComponentCatalog.Parent>[PageContent](./quick-start/#pagecontent)</ComponentCatalog.Parent>
</ComponentCatalog.Container>

## Layout

The Layout component allows you to customize the layout engine’s behavior for its children.
All props are optional and follow this order of precedence:

1. Props defined on this `Layout` component (highest priority)
1. Props inherited from the nearest parent `Layout` component
1. Global configuration provided to [Section](./quick-start/#section)

The available values are described in [Configuration](../configuration).

```jsx
<Layout
    hyphen={string | undefined}
    keepOnSamePage={boolean | undefined}
    hyphenationEnabled={boolean | undefined}
>
    <p>...</p>
</Layout>
```

<ComponentCatalog.Container isHook>
<ComponentCatalog.Parent>[PageContent](./quick-start/#pagecontent)</ComponentCatalog.Parent>
</ComponentCatalog.Container>
