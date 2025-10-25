---
sidebar_position: 4
---

# Configuration

Configuration customizes the pagination engine and is provided at the section level, but it can also be overridden for individual elements within the page content.

## General Configuration

For each element, the general configuration is read from the element itself. If not available, it is inherited from the nearest parent element, continuing up the hierarchy until the section component is reached. How you provide the configuration depends on the framework you are using.

| Name               | Type    | Default | Description                                                                                                                                                                                                                                      |
| :----------------- | :------ | :-----: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| hyphen             | string  |   '-'   | Specifies the character that will be used for hyphenation when a word is broken across lines.                                                                                                                                                    |
| hyphenationEnabled | boolean |  true   | If a word (a sequence of text without whitespace) does not fit on the current page, the pagination engine will break the word and insert the hyphen character at the breaking point.                                                             |
| keepOnSamePage     | boolean |  false  | Avoid breaking an element across pages.<br /> If an element does not fit in the available space on the current page, it will be moved entirely to the next page. If it still does not fit on an empty page, it will be ignored and not rendered. |

## Section Configuration

Sections, in addition to the general configuration, also support specific configuration options. These options are available only at the section level and cannot be provided or overridden by other elements in the report.

| Name    | Type                            | Default                                     | Description                                                                                    |
| :------ | :------------------------------ | :------------------------------------------ | :--------------------------------------------------------------------------------------------- |
| id      | string                          | Random unique value                         | A unique identifier for the section. It can be used to monitor or control the section’s state. |
| plugins | [PaginationPlugin[]](plugin.md) | [defaultPlugins](plugin.md#default-plugins) | Customize the pagination engine’s behavior using plugins.                                      |
