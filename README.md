# Paprize

**Build clean, print-ready reports with familiar web tools.**

Paprize is a report-generation toolkit that lets you design pages with JavaScript/TypeScript, React, and CSS. Mark your layout with Paprize components, then let its pagination engine split content into polished, printable pages.

## Documentation

For guides, API references, and full examples, visit [paprize.page](https://paprize.page).

## Why Paprize

- **Web-native authoring**: Build reports with standard HTML and CSS.
- **Automatic pagination**: Split long content into pages without manual slicing.
- **Composable layout primitives**: Structure reports with sections, headers, footers, and content wrappers.
- **Print-ready output**: Configure A4, Letter, or custom sizes and margins.

![Paprize components](https://raw.githubusercontent.com/PejmanNik/paprize/refs/heads/main/website/static/img/components.svg)

## Packages

- `@paprize/react`: React components for report layout and pagination.
- `@paprize/vanilla`: Framework-agnostic DOM API.
- `@paprize/puppeteer`: PDF rendering adapter for server-side generation.

## Installation

Choose one UI package (`react` or `vanilla`), and if you need server-side PDF generation, pair it with the Puppeteer adapter.

```bash
# React
npm install @paprize/react @paprize/puppeteer

# Vanilla JavaScript/TypeScript
npm install @paprize/vanilla @paprize/puppeteer
```

## Quick Start

### Vanilla HTML

```html
<div data-pz-preview>
    <div data-pz-section>
        <div data-pz-page-header>
            <h2>Page <span data-pz-v-page-number></span></h2>
        </div>

        <div data-pz-page-content>...</div>
    </div>
</div>
```

### React

```tsx
function App() {
    return (
        <ReportRoot>
            <ReportPreview>
                <Section size={pageSize.A4}>
                    <PageHeader>
                        <Header />
                    </PageHeader>

                    <PageContent>
                        <Finance />
                        <Business />
                    </PageContent>

                    <PageFooter>
                        <Footer />
                    </PageFooter>
                </Section>
            </ReportPreview>
        </ReportRoot>
    );
}
```
