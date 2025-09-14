import { useId, useMemo, type ReactNode } from 'react';
import type { PageDimension, PageMargin, PageOrientation } from './pageTypes';
import parseSectionChildren from './parseSectionChildren';
import { adjustDimension, buildSectionStyle } from './Section.utilities';
import { SectionLayout } from './SectionLayout';
import { SectionContext } from './SectionContext';
import type { PaginationConfig } from '@paprize/core/src';
import { useSetSectionState } from './useSetSectionInfo';
import { useStyle } from './useStyle';

export interface SectionProps {
    children: ReactNode;
    dimension: PageDimension;
    orientation?: PageOrientation;
    margin?: PageMargin;
    options?: PaginationConfig;
    name?: string;
}

export function Section({
    children,
    dimension,
    orientation = 'portrait',
    margin,
    options,
    name,
}: SectionProps) {
    const id = useId();
    const sectionName = name ?? id;
    const setSectionInfo = useSetSectionState(sectionName);

    useMemo(() => {
        setSectionInfo((pre) => ({ ...pre, isPaginated: false }));
    }, [setSectionInfo]);

    const props = useMemo(
        () => ({
            dimensions: adjustDimension(dimension, orientation),
            elements: parseSectionChildren(children),
            margin: margin,
            options: options,
        }),
        [children, dimension, margin, options, orientation]
    );

    useStyle(buildSectionStyle(id, props.dimensions));

    return (
        <section
            className="paprize-section"
            id={`section-${sectionName}`}
            style={{ page: `section-${sectionName}` }}
        >
            <SectionContext value={sectionName}>
                <SectionLayout
                    elements={props.elements}
                    dimensions={props.dimensions}
                    margin={props.margin}
                    options={props.options}
                />
            </SectionContext>
        </section>
    );
}
