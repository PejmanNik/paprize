import { useContext, useMemo, type Ref } from 'react';
import { type PageElements } from '../internal/parseSectionChildren';
import { PageInfoContext } from '../internal/PageInfoContext';
import { SectionIdContext } from '../internal/SectionIdContext';
import {
    pageClassName,
    pageMargin,
    reportStyles,
    type PageSize,
    type PageMargin,
} from '@paprize/core/src';

export interface PageProps {
    elements: PageElements;
    size: PageSize;
    margin?: PageMargin;
    pageIndex: number;
    totalPages: number;
    ref?: Ref<HTMLDivElement>;
    sectionHeaderRef?: Ref<HTMLDivElement>;
    sectionFooterRef?: Ref<HTMLDivElement>;
    pageHeaderRef?: Ref<HTMLDivElement>;
    pageFooterRef?: Ref<HTMLDivElement>;
    contentRef?: Ref<HTMLDivElement>;
}

export function Page({
    elements,
    size,
    margin,
    pageIndex,
    totalPages,
    ref,
    sectionHeaderRef,
    sectionFooterRef,
    pageHeaderRef,
    pageFooterRef,
    contentRef,
}: PageProps) {
    const sectionId = useContext(SectionIdContext);
    const contextValue = useMemo(
        () => ({ pageIndex, totalPages }),
        [pageIndex, totalPages]
    );

    return (
        <PageInfoContext value={contextValue}>
            <div
                id={`${sectionId}-${pageIndex}`}
                className={pageClassName}
                ref={ref}
                style={reportStyles.page(size, margin ?? pageMargin.None)}
            >
                {elements.sectionHeader && pageIndex === 0 && (
                    <div style={reportStyles.component} ref={sectionHeaderRef}>
                        {elements.sectionHeader}
                    </div>
                )}
                {elements.header && (
                    <div style={reportStyles.component} ref={pageHeaderRef}>
                        {elements.header}
                    </div>
                )}

                <div style={reportStyles.pageContent} ref={contentRef}>
                    {elements.content}
                </div>

                {elements.overlay && (
                    <div style={reportStyles.overlay}>{elements.overlay}</div>
                )}

                {(elements.footer || elements.sectionFooter) && (
                    <div
                        style={{ ...reportStyles.component, marginTop: 'auto' }}
                    >
                        {elements.footer && (
                            <div
                                style={reportStyles.component}
                                ref={pageFooterRef}
                            >
                                {elements.footer}
                            </div>
                        )}
                        {elements.sectionFooter &&
                            pageIndex === totalPages - 1 && (
                                <div
                                    style={reportStyles.component}
                                    ref={sectionFooterRef}
                                >
                                    {elements.sectionFooter}
                                </div>
                            )}
                    </div>
                )}
            </div>
        </PageInfoContext>
    );
}
