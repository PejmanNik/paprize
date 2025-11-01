---
sidebar_position: 7
---

import ComponentCatalog from "@site/src/components/ComponentCatalog";

# Section Suspension

The pagination engine runs immediately after the initial render of each section. In some cases, you may need to suspend the engine until your data is available; for example, when fetching data from an API or external service, or when you require information from other sections of the report (such as when generating a table of contents).

`useSectionSuspension` hook will suspense the pagination process for the selected section until you release it:

```jsx
const { release } = useSectionSuspension(sectionName);
```

For example, to use all section names within a `PageContent` component:

```jsx
function SectionList() {
    const { sections, isFirstPaginationCompleted } = useReportInfo();
    const { sectionName } = useSectionInfo();
    const { release } = useSectionSuspension(sectionName);

    useEffect(() => {
        if (isFirstPaginationCompleted) {
            release();
        }
    }, [release, isFirstPaginationCompleted]);

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
<ComponentCatalog.Parent>[Section](/react/components.md#section)</ComponentCatalog.Parent>
</ComponentCatalog.Container>
