import { useMemo, type ReactNode } from 'react';
import parseSectionChildren from '../internal/parseSectionChildren';
import { SectionIdContext } from '../internal/SectionIdContext';
import {
    adjustPageSize,
    reportStyles,
    sectionClassName,
    type PageSize,
    type PageMargin,
    type PageOrientation,
    type PaginationOptions,
} from '@paprize/core/src';
import { SectionLayout } from '../internal/SectionLayout';

export interface SectionProps {
    children: ReactNode;
    id?: string;
    size: PageSize;
    orientation?: PageOrientation;
    margin?: PageMargin;
    config?: Partial<PaginationOptions>;
}

let sectionIdCounter = 1;

export function Section({
    children,
    id,
    size,
    orientation = 'portrait',
    margin,
    config,
}: SectionProps) {
    const sectionId = useMemo(() => id ?? `__000${sectionIdCounter++}`, [id]);
    const elements = useMemo(() => parseSectionChildren(children), [children]);

    const adjustedSize = useMemo(
        () => adjustPageSize(size, orientation),
        [size, orientation]
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
                    size={adjustedSize}
                    margin={margin}
                    config={config}
                />
            </SectionIdContext>
        </section>
    );
}
