---
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ComponentCatalog from '@site/src/components/ComponentCatalog';

# Inject Data

This feature allows you to pass a serialized JSON object to the `reportToPdf` function during the report building process, making the data available inside your report components.

```ts
import { promises as fs } from 'fs';

const jsonData = await fs.readFile('my-json-data.json', 'utf-8');
await reportToPdf(page, '/', jsonData);
```

<Tabs>
<TabItem value="ts" label="Vanilla">

```ts
//WIP
```

</TabItem>
<TabItem value="react" label="React">

```tsx
interface MyData {
    name: string;
    lastName: string;
    age: number;
}

const defaultData = {
    name: 'John',
    lastName: 'Doe',
    age: 44,
};

function MyComponent() {
    const data = useJsonData<MyData>(defaultData);

    return `By ${data.name} ${data.lastName}`;
}
```

<ComponentCatalog.Container noChildren>
<ComponentCatalog.Parent>[Section](/react/components.md#section)</ComponentCatalog.Parent>
</ComponentCatalog.Container>

</TabItem>
</Tabs>
