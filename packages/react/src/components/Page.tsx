import { useContext, useMemo, type Ref } from 'react';
import { type PageElements } from './parseSectionChildren';
import type { PageDimension, PageMargin } from './pageTypes';
import { PageContext } from './PageContext';
import { shorthand } from './Page.utilities';
import { SectionContext } from './SectionContext';

export interface PageProps {
    elements: PageElements;
    dimensions: PageDimension;
    margin?: PageMargin;
    pageNumber: number;
    totalPages: number;
    ref?: Ref<HTMLDivElement>;
    sectionHeaderRef?: Ref<HTMLDivElement>;
    sectionFooterRef?: Ref<HTMLDivElement>;
    contentRef?: Ref<HTMLDivElement>;
}

export function Page({
    elements,
    dimensions,
    margin,
    pageNumber,
    totalPages,
    ref,
    sectionHeaderRef,
    sectionFooterRef,
    contentRef,
}: PageProps) {
    const sectionId = useContext(SectionContext);
    const contextValue = useMemo(
        () => ({ pageNumber, totalPages }),
        [pageNumber, totalPages]
    );

    return (
        <PageContext value={contextValue}>
            <div
                id={`${sectionId}-${pageNumber}`}
                className="paprize-page paprize-page-component"
                ref={ref}
                style={{
                    width: dimensions.width,
                    height: dimensions.height,
                    maxHeight: dimensions.height,
                    position: 'relative',
                    padding: shorthand(margin),
                    zIndex: 1,
                }}
            >
                {elements.sectionHeader && pageNumber == 1 && (
                    <div
                        className="paprize-page-component"
                        ref={sectionHeaderRef}
                    >
                        {elements.sectionHeader}
                    </div>
                )}
                {elements.header && (
                    <div className="paprize-page-component">
                        {elements.header}
                    </div>
                )}

                <div
                    style={{
                        overflow: 'hidden',
                        width: '100%',
                        height: `100%`,
                    }}
                    ref={contentRef}
                >
                    {elements.content}
                </div>

                {elements.overlay && (
                    <div
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            left: 0,
                            top: 0,
                        }}
                    >
                        {elements.overlay}
                    </div>
                )}

                {(elements.footer || elements.sectionFooter) && (
                    <div
                        className="paprize-page-component"
                        style={{ marginTop: 'auto' }}
                    >
                        {elements.footer && (
                            <div className="paprize-page-component">
                                {elements.footer}
                            </div>
                        )}
                        {elements.sectionFooter && pageNumber == totalPages && (
                            <div
                                className="paprize-page-component"
                                ref={sectionFooterRef}
                            >
                                {elements.sectionFooter}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </PageContext>
    );
}
