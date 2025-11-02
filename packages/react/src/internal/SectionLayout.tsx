import {
    reportStyles,
    type PageContext,
    type PageSize,
    type PageMargin,
    type PaginationOptions,
} from '@paprize/core/src';
import { useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Page } from '../components/Page';
import { useReportBuilder } from './useReportBuilder';
import { SectionIdContext } from './SectionIdContext';
import type { PageElements } from './parseSectionChildren';
import { useSectionControllerState } from './useSectionControllerState';
import { SectionControllerContext } from './SectionControllerContext';

export interface SectionLayoutProps {
    elements: PageElements;
    size: PageSize;
    margin: PageMargin | undefined;
    config?: Partial<PaginationOptions>;
}

export function SectionLayout({
    elements,
    size,
    margin,
    config,
}: SectionLayoutProps) {
    const sectionId = useContext(SectionIdContext);
    const { controllerState, controllerValue } = useSectionControllerState(
        config?.plugins
    );
    const reportBuilder = useReportBuilder();
    const pageRef = useRef<HTMLDivElement>(null);
    const sectionHeaderRef = useRef<HTMLDivElement>(null);
    const sectionFooterRef = useRef<HTMLDivElement>(null);
    const pageHeaderRef = useRef<HTMLDivElement>(null);
    const pageFooterRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [pageContexts, setPageContexts] = useState<PageContext[] | null>(
        null
    );

    useEffect(() => {
        if (!contentRef.current) {
            return;
        }

        reportBuilder.tryAddSection(
            {
                ...config,
                id: sectionId,
                size: size,
                margin: margin,
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
    }, [config, controllerState, size, margin, reportBuilder, sectionId]);

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
                    size={size}
                    margin={margin}
                    pageIndex={pageContext.pageIndex}
                    totalPages={pageContext.totalPages}
                />
            ))}

            {createPortal(
                <div style={reportStyles.outOfScreen}>
                    <Page
                        elements={elements}
                        size={size}
                        margin={margin}
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
