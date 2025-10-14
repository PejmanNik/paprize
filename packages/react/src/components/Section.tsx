import { useMemo, type ReactNode } from 'react';
import parseSectionChildren from '../internal/parseSectionChildren';
import { SectionIdContext } from '../internal/SectionIdContext';
import {
    adjustDimension,
    reportStyles,
    sectionClassName,
    type PageDimension,
    type PageMargin,
    type PageOrientation,
    type PaginationConfig,
} from '@paprize/core/src';
import { SectionLayout } from '../internal/SectionLayout';

export interface SectionProps {
    children: ReactNode;
    id?: string;
    dimension: PageDimension;
    orientation?: PageOrientation;
    margin?: PageMargin;
    config?: Partial<PaginationConfig>;
}

let sectionIdCounter = 1;

export function Section({
    children,
    id,
    dimension,
    orientation = 'portrait',
    margin,
    config,
}: SectionProps) {
    const sectionId = useMemo(() =>  id ?? `__000${sectionIdCounter++}`, [id]);
    const elements = useMemo(() => parseSectionChildren(children), [children]);

    const adjustedDimension = useMemo(
        () => adjustDimension(dimension, orientation),
        [dimension, orientation]
    );

    return (
        <section
            className={sectionClassName}
            id={sectionId}
            style={reportStyles.section(sectionId)}
        >
            <SectionIdContext value={sectionId}>
                <SectionLayout
                    elements={elements}
                    dimension={adjustedDimension}
                    margin={margin}
                    config={config}
                />
            </SectionIdContext>
        </section>
    );
}
