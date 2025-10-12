import {
    Children,
    isValidElement,
    type FC,
    type ReactElement,
    type ReactNode,
} from 'react';
import { PageContent } from '../components/PageContent';
import { PageFooter } from '../components/PageFooter';
import { PageHeader } from '../components/PageHeader';
import { SectionFooter } from '../components/SectionFooter';
import { SectionHeader } from '../components/SectionHeader';
import { PageOverlay } from '../components/PageOverlay';
import logger from 'loglevel';

const validChildren: FC<{ children: ReactNode }>[] = [
    PageContent,
    PageHeader,
    PageFooter,
    PageOverlay,
    SectionHeader,
    SectionFooter,
];

export interface PageElements {
    content: ReactElement;
    header?: ReactElement;
    footer?: ReactElement;
    overlay?: ReactElement;
    sectionHeader?: ReactElement;
    sectionFooter?: ReactElement;
}

function parseSectionChildren(children: ReactNode): PageElements {
    let content: ReactElement | null = null;
    const pageElements: Partial<PageElements> = {};

    Children.forEach(children, (child) => {
        if (!isValidElement(child)) {
            logger.error('Invalid React element found in children', { child });
            throw new Error('Invalid React element found in children');
        }

        const component = validChildren.find((x) => x === child.type);
        if (!component) {
            throw Error(
                `Component "${child.type}" is not valid as a child for Section, Expected one of: ${validChildren
                    .map((x) => x.name)
                    .join(',')}`
            );
        }

        switch (component) {
            case SectionHeader:
                pageElements.sectionHeader = child;
                break;

            case SectionFooter:
                pageElements.sectionFooter = child;
                break;

            case PageContent:
                content = child;
                break;

            case PageHeader:
                pageElements.header = child;
                break;

            case PageFooter:
                pageElements.footer = child;
                break;

            case PageOverlay:
                pageElements.overlay = child;
                break;
        }
    });

    if (!content) {
        throw Error('PageContent component is a required child for Section');
    }

    return { ...pageElements, content: content };
}

export default parseSectionChildren;
