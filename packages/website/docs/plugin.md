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
import { pageBreakPlugin } from '@paprize/core';

const customPlugins = [myCustomPlugin, pageBreakPlugin];
```

The default plugin set includes:

1. **pageBreakPlugin:** Provides support for the PageBreak component.
1. **tablePlugin:** Provides consistent HTML table rendering, ensuring that rows are kept intact and not broken across pages.
