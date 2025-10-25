---
sidebar_position: 4
---

# Plugin

The pagination engine supports **plugins** that provide flexibility to modify its behavior and add extra features to the core engine.

Some key components, such as `PageBreaks`, work through this plugin system. These plugins are included as part of the **default plugin set**, so they are available out of the box. You can disable some or all of the default plugins by providing a custom plugin set for each section.

## Default Plugins

Paprize provides a set of default plugins. If no plugins are passed to a Section, it will automatically use this default set. However, if you define a custom plugin set, you must explicitly include the default plugins in order to retain the built-in functionality.

```tsx
import { defaultPlugins } from '@paprize/core';

const customPlugins = [myCustomPlugin, ...defaultPlugins];
```

You can also selectively import the provided plugins.

```tsx
import { PageBreakPlugin } from '@paprize/core';

const customPlugins = [myCustomPlugin, new PageBreakPlugin()];
```

The default plugin set includes:

1. **PageBreakPlugin:** Provides support for the PageBreak component.
1. **TablePlugin:** Provides consistent HTML table rendering, ensuring that rows are kept intact and not broken across pages.

## PageBreak Plugin

The Page Break plugin ends the current page when it encounters an HTML node with the attribute `data-pz-page-break="true"`, and immediately starts a new page.

```tsx
import { PageBreakPlugin } from '@paprize/core';

const plugins = [new PageBreakPlugin()];
```

## Table Plugin

You can create an instance of the Table plugin with the desired options. These options control the table’s layout. For example, setting `cloneHeader` to `true` ensures the header is repeated on every page when the table spans multiple pages.

```tsx
import { TablePlugin } from '@paprize/core';

const plugins = [new TablePlugin({ cloneHeader: true })];
```
