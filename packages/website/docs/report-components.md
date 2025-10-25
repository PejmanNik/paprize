---
sidebar_position: 2
---

import ComponentsDiagram from '@site/src/components/ComponentsDiagram';

# Report components

Reports are created by wrapping your logic, content, and layout with the **Paprize** component. Unlike printing a normal web page, where the browser handles pagination internally with very limited control, Paprize allows you to customize exactly how content is paginated

<ComponentsDiagram />

### Section

The fundamental building block of every report is the **Section**.

- Each report must contain **at least one** Section.
- A Section can define its own page size, headers, and footers.
- All other components are available only within a Section.
- Only one instance of each component type can exist per Section.
- All components are optional except **Page Content**. In other words every Section must contain **exactly one** Page Content component.

### Section Header

Appears at the start of a Section. It is rendered **only on the first page** of the Section.

### Page Header

Appears at the start of **each page**.

- If a Section Header is present, the Page Header on the first page will appear **after** the Section Header.

### Page Content

Contains the main content of the report.

- The pagination engine runs only on this component.
- Content is split across pages based on the Section’s page size, headers, and footers.
- Pagination is performed on cloned DOM elements. The original DOM elements and their state will be discarded after pagination.

### Page Overlay

Adds extra content **on top of or behind** each page.

- Common use cases include watermarking or placing fixed elements (e.g., live inputs) at specific positions.
- Overlays are **not paginated**, so handling possible collisions is the responsibility of the user.

### Page Footer

Appears at the end of **each page**.

- If a Section Footer is present, the Page Footer on the last page will appear **before** the Section Footer.

### Section Footer

Appears at the end of a Section. It is rendered **only on the last page** of the Section.
