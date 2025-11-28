---
sidebar_position: 2
---

# PaprizeReport

The [PaprizeReport](api.md#paprizereport) class is responsible for building the report and handling pagination. You need to create an instance of it with the desired [options](api.md#paprizereportoptions).

After organizing your report with [Report Components](/components/report-components.md), you must [register](api#addsection) each section within the `PaprizeReport` instance. Provide a unique ID, specify the [page size](/core/api.md#pagesize), and define other [SectionOptions](/core/api.md#sectionoptions). Once configured, you can [schedule a pagination operation](api.md#schedulepagination).

During pagination, the report replaces your initial DOM content. While the process runs, the report components are hidden from the user. Note that the scheduler does **not** support parallel pagination operations, see details [here](api.md#schedulepagination).

If you need access to page information (e.g., page number or total pages), subscribe to the pagination events and modify the paginated content accordingly, as described in [PageInfo](page-info.md).

Changes to the initial DOM elements have no effect, since the pagination engine operates on cloned elements. All original state and event handlers attached to the initial DOM will be lost during the pagination process.

```ts
import { pageSize, pageMargin } from '@paprize/core';
import { PaprizeReport } from '@paprize/vanilla';

const report = new PaprizeReport();

await report.addSection({
    id: 'section-1',
    dimension: pageSize.A4,
    margin: pageMargin.Narrow,
    ...configs,
});

await r.schedulePagination();
```
