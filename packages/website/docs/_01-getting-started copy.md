# Getting Started

Get started by adding the `@paprize/react` library to your React project.

```
npm install @paprize/react
```

Create your awesome report by adding the [ReportRoot](components/report/report-root) and then [Section](components/section) component. Check the component list for a detail list of available components.

[Live example](https://codesandbox.io/s/jikji-example-14useg)

```
import {
    PageContent,
    PageFooter,
    PageHeader,
    pageMargin,
    pageSize,
    ReportRoot,
    ReportView,
    Section,
} from '@paprize/react';

function MyReport() {
    return (
        <ReportRoot>
            <ReportView>
                <Section dimension={pageSize.A4} margin={pageMargin.Narrow}>
                    <PageHeader>Page Header</PageHeader>
                    <PageContent>
                        <p>My awesome report content</p>
                    </PageContent>
                    <PageFooter>Page Footer</PageFooter>
                </Section>
            </ReportView>
        </ReportRoot>
    );
}

export default MyReport;
```

paprize support two mode for creating reports. Client side rendering and server side generation. Each on come with a own benefit and limitation. You can read about each version in [CSR vs SSG](./csr-vs-ssg).

This library uses two-phase rendering to create a report, Each component will mount two times, it is important to remember your component's dimensions **MUST NOT** changed during this two phase, consider enough space if you have dynamic contents (like page number or date-time). More detail in [Avoid Dynamic Height](./avoid-dynamic-height.md).
