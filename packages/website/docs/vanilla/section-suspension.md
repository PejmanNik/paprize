---
sidebar_position: 3
---

# Section Suspension

The pagination engine runs for each registered section in order. In some cases, you may need to suspend the engine until your data becomes available — for example, when a section requires information from other sections of the report (such as when generating a table of contents).

By providing a list of promises in the `suspense` option of [SectionOptions](/core/api.md#sectionoptions), you can control the section’s suspension. When you [schedule a pagination operation](api#schedulepagination) and a section has pending promises in `suspense`, the pagination engine will skip that section until all promises for that section are resolved or rejected.

```ts
const report = new PaprizeReport();

let resolve: () => void;
const myPromise = new Promise<void>((res) => {
    resolve = res;
});

report.addSection({
    id: 'section-1',
    dimension: pageSize.A4,
    suspense: [myPromise],
});

report.addSection({
    id: 'section-2',
    dimension: pageSize.A4,
});

// Pagination will not run for section-1, but section-2 will be paginated.
await r.schedulePagination();

// After 2 seconds, the pagination operation will run for section-1.
setTimeout(() => {
    resolve();
}, 2000);
```
