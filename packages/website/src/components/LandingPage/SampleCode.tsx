import CodeBlock from '@theme/CodeBlock';

export function SampleCode({ className }: { className: string }) {
    const code = `export default function App() {
  return (
    <ReportRoot>
      <Section size={pageSize.A4} margin={pageMargin.Narrow}>
        <PageHeader> ... </PageHeader>
        <PageFooter> ... </PageFooter>
        <PageContent> ... </PageContent>
      </Section>
    </ReportRoot>
  );
  }`;
    return (
        <div className={className}>
            <CodeBlock language="tsx">{code}</CodeBlock>
        </div>
    );
}
