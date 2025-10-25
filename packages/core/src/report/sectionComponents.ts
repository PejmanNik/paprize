export interface SectionComponents {
    sectionHeader: HTMLElement | null;
    sectionFooter: HTMLElement | null;
    pageHeader: HTMLElement | null;
    pageFooter: HTMLElement | null;
    pageContent: HTMLElement;
}

function cloneElement<T extends HTMLElement | null>(element?: T): T {
    return (element?.cloneNode(true) ?? null) as T;
}

export function cloneComponents(
    components: SectionComponents
): SectionComponents {
    return {
        sectionHeader: cloneElement(components.sectionHeader),
        sectionFooter: cloneElement(components.sectionFooter),
        pageHeader: cloneElement(components.pageHeader),
        pageFooter: cloneElement(components.pageFooter),
        pageContent: cloneElement(components.pageContent),
    };
}
