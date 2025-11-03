import {
    adjustPageSize,
    reportStyles,
    type PageContext,
    type SectionOptions,
} from '@paprize/core/src';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Page } from '../components/Page';
import { useReportBuilder } from './useReportBuilder';
import { SectionIdContext } from './SectionIdContext';
import type { PageElements } from './parseSectionChildren';
import { useSectionControllerState } from './useSectionControllerState';
import { SectionControllerContext } from './SectionControllerContext';

export interface SectionLayoutProps {
    elements: PageElements;
    options: SectionOptions;
}

export function SectionLayout({ elements, options }: SectionLayoutProps) {
    const sectionId = useContext(SectionIdContext);
    const { controllerState, controllerValue } = useSectionControllerState(
        options?.plugins
    );
    const reportBuilder = useReportBuilder();
    const pageRef = useRef<HTMLDivElement>(null);
    const sectionHeaderRef = useRef<HTMLDivElement>(null);
    const sectionFooterRef = useRef<HTMLDivElement>(null);
    const pageHeaderRef = useRef<HTMLDivElement>(null);
    const pageFooterRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const realizedSize = useMemo(
        () => adjustPageSize(options.size, options.orientation),
        [options.orientation, options.size]
    );
    const [pageContexts, setPageContexts] = useState<PageContext[] | null>(
        null
    );

    useEffect(() => {
        if (!contentRef.current) {
            return;
        }

        reportBuilder.tryAddSection(
            {
                ...options,
                id: sectionId,
                plugins: controllerState.plugins,
                suspense: controllerState.suspense,
            },
            {
                pageContent: contentRef.current,
                sectionHeader: sectionHeaderRef.current,
                sectionFooter: sectionFooterRef.current,
                pageFooter: pageFooterRef.current,
                pageHeader: pageHeaderRef.current,
            },
            (pages) => {
                setPageContexts(pages);
            }
        );

        return () => {
            reportBuilder.removeSection(sectionId);
        };
    }, [
        controllerState.plugins,
        controllerState.suspense,
        options,
        reportBuilder,
        sectionId,
    ]);

    return (
        <SectionControllerContext value={controllerValue}>
            {pageContexts?.map((pageContext) => (
                <Page
                    key={pageContext.pageIndex}
                    elements={{
                        ...elements,
                        content: (
                            <div
                                style={{ display: 'contents' }}
                                dangerouslySetInnerHTML={{
                                    __html: pageContext.pageContentHtml,
                                }}
                            />
                        ),
                    }}
                    size={realizedSize}
                    margin={options.margin}
                    pageIndex={pageContext.pageIndex}
                    totalPages={pageContext.totalPages}
                />
            ))}

            {createPortal(
                <div style={reportStyles.outOfScreen}>
                    <Page
                        elements={elements}
                        size={realizedSize}
                        margin={options.margin}
                        pageIndex={0}
                        totalPages={1}
                        ref={pageRef}
                        sectionHeaderRef={sectionHeaderRef}
                        sectionFooterRef={sectionFooterRef}
                        pageHeaderRef={pageHeaderRef}
                        pageFooterRef={pageFooterRef}
                        contentRef={contentRef}
                    />
                </div>,
                document.body
            )}
        </SectionControllerContext>
    );
}
