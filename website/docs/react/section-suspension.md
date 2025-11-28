---
sidebar_position: 7
---

import ComponentCatalog from "@site/src/components/ComponentCatalog";

# Section Suspension

The pagination engine runs immediately after the initial render of each section. In some cases, you may need to suspend the engine until your data becomes available — for example, when a section requires information from other sections of the report (such as when generating a table of contents).

[useSectionSuspension](/react/api.md#usesectionsuspension) hook will suspense the pagination process for the section until you release it:

```jsx
const { release, reset } = useSectionSuspension();
```

For example, to use all section names within a `PageContent` component:

```tsx
function SectionList() {
    const { sections } = useReportInfo();
    const { sectionId } = useSectionInfo();
    const { release, reset } = useSectionSuspension();

    const allOtherArePaginated = sections.every((s) =>
        s.sectionId === sectionId ? !s.isPaginated : s.isPaginated
    );

    useEffect(() => {
        if (allOtherArePaginated) {
            release();
        }
    }, [release, allOtherArePaginated]);

    return (
        <nav>
            <ul>
                {sections.map((section) => (
                    <li key={section.sectionName}>{section.sectionName}</li>
                ))}
            </ul>
        </nav>
    );
}
```

<ComponentCatalog.Container noChildren>
<ComponentCatalog.Parent>[Section](/components/report-components.md#section)</ComponentCatalog.Parent>
</ComponentCatalog.Container>
