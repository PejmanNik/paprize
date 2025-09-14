# Plugin

The layout engine supports **plugins** that provide flexibility to modify its behavior and add extra features to the core engine.

Some key components, such as `PageBreaks`, work through this plugin system. These plugins are included as part of the **default plugin set**, so they are available out of the box. You can disable some or all of the default plugins by providing a custom plugin set for each section.

## Default Plugins

Paprize exposes a set of default plugins. Depending on your framework, you can import the default set, which includes:

1. PageBreak
