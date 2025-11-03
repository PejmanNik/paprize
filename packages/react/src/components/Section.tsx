import { useMemo, type ReactNode } from 'react';
import parseSectionChildren from '../internal/parseSectionChildren';
import { SectionIdContext } from '../internal/SectionIdContext';
import {
    reportStyles,
    sectionClassName,
    type SectionOptions,
} from '@paprize/core/src';
import { SectionLayout } from '../internal/SectionLayout';

/**
 * Configuration options for a section.
 * @inlineType SectionOptions
 */
export interface SectionProps extends Omit<SectionOptions, 'id' | 'suspense'> {
    children: ReactNode;
    /**
     * Unique id of the section within the report. If not set, a random id will be used.
     */
    id?: string;
}

let sectionIdCounter = 1;

export function Section({ children, id, ...options }: SectionProps) {
    const sectionId = useMemo(() => id ?? `__000${sectionIdCounter++}`, [id]);
    const elements = useMemo(() => parseSectionChildren(children), [children]);
    const sectionOptions = useMemo(
        () => ({
            ...options,
            id: sectionId,
        }),
        [options, sectionId]
    );

    return (
        <section
            className={sectionClassName}
            id={sectionId}
            style={reportStyles.section(sectionId)}
        >
            <SectionIdContext value={sectionId}>
                <SectionLayout elements={elements} options={sectionOptions} />
            </SectionIdContext>
        </section>
    );
}
