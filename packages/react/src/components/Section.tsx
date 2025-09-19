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
    config?: Partial<PaginationConfig>;
}

export function Section({
    children,
    dimension,
    orientation = 'portrait',
    margin,
    config,
}: SectionProps) {
    const id = useId();
    const configWithId = useMemo(
        () => ({ ...config, id: config?.id ?? id }),
        [config, id]
    );
    const sectionId = configWithId.id;
    const setSectionInfo = useSetSectionState(sectionId);

    useMemo(() => {
        setSectionInfo((pre) => ({ ...pre, isPaginated: false }));
    }, [setSectionInfo]);

    const props = useMemo(
        () => ({
            dimensions: adjustDimension(dimension, orientation),
            elements: parseSectionChildren(children),
            margin: margin,
            config: configWithId,
        }),
        [children, dimension, margin, configWithId, orientation]
    );

    useStyle(buildSectionStyle(sectionId, props.dimensions));

    return (
        <section
            className="paprize-section"
            id={`section-${sectionId}`}
            style={{ page: `section-${sectionId}` }}
        >
            <SectionContext value={sectionId}>
                <SectionLayout
                    elements={props.elements}
                    dimensions={props.dimensions}
                    margin={props.margin}
                    config={props.config}
                />
            </SectionContext>
        </section>
    );
}
