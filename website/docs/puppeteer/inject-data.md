---
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ComponentCatalog from '@site/src/components/ComponentCatalog';

# Inject Data

This feature allows you to pass a serializable object to the `reportToPdf` function during the report building process, making the data available inside your report components.

```ts title="script.ts"
import { promises as fs } from 'fs';

const jsonData = await fs.readFile('my-json-data.json', 'utf-8');
await reportToPdf(page, '/', jsonData);
```

```ts title="MyReportData.ts"
interface MyReportData {
    info: {
        name: string;
        lastName: string;
        age: number;
    };
}

const defaultData = {
    info: { name: 'John', lastName: 'Doe', age: 44 },
};
```

<Tabs>
<TabItem value="Zero" label="Zero">

```html
<span data-pz-v-json-data-key="info.lastName"></span>
```

The element’s content will be replaced with the provided data after pagination is completed.

</TabItem>
<TabItem value="Vanilla" label="Vanilla">

- By attribute:
  The element’s content will be replaced with the provided data after pagination is completed.

```html
<span data-pz-v-json-data-key="info.name"></span>
```

- Or by code:

```ts
import { pageSize, pageMargin } from '@paprize/core';
import { PaprizeReport } from '@paprize/vanilla';

const report = new PaprizeReport();

...

report.monitor.addEventListener('pageCompleted', async (pageContext) => {
    const json = await report.getJsonData(defaultData);
    pageContext.components.pageContent.textContent.replaceAll(
        '{NAME}',
        json.info.name
    );
});

...

```

</TabItem>
<TabItem value="React" label="React">

```tsx
function MyComponent() {
    const data = useJsonData<MyData>(defaultData);

    return `By ${data.info.name} ${data.info.lastName}`;
}
```

<ComponentCatalog.Container noChildren>
<ComponentCatalog.Parent>[Section](/components/report-components.md#section)</ComponentCatalog.Parent>
</ComponentCatalog.Container>

</TabItem>
</Tabs>
