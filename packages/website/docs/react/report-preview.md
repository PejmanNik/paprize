---
sidebar_position: 5
---

# Report Preview

This component applies styling to sections and pages to resemble Chrome’s Print Preview screen.

Since you don’t have control over the client’s browser, user extensions may inject extra elements into the page and cause issues when printing. The Report Preview component ensures a clean output by hiding all non-Paprize elements during print.

![Sample Report](/img/sample-report-1.png)

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
