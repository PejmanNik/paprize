import { useMemo, type Ref } from 'react';
import { type PageElements } from './parseSectionChildren';
import type { PageDimension, PageMargin } from './pageTypes';
import { PageContext } from './PageContext';
import { shorthand } from './Page.utilities';

export interface PageProps {
    elements: PageElements;
    dimensions: PageDimension;
    margin?: PageMargin;
    pageIndex: number;
    ref?: Ref<HTMLDivElement>;
    sectionHeaderRef?: Ref<HTMLDivElement>;
    sectionFooterRef?: Ref<HTMLDivElement>;
    contentRef?: Ref<HTMLDivElement>;
}

export function Page({
    elements,
    dimensions,
    margin,
    pageIndex,
    ref,
    sectionHeaderRef,
    sectionFooterRef,
    contentRef,
}: PageProps) {
    const contextValue = useMemo(
        () => ({ pageNumber: pageIndex + 1 }),
        [pageIndex]
    );

    return (
        <PageContext value={contextValue}>
            <div
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
                {pageIndex == 0 && (
                    <div
                        className="paprize-page-component"
                        ref={sectionHeaderRef}
                    >
                        {elements.sectionHeader}
                    </div>
                )}
                <div className="paprize-page-component"> {elements.header}</div>

                <div
                    style={{
                        overflow: 'hidden',
                    }}
                    ref={contentRef}
                >
                    {elements.content}
                </div>

                <div style={{ position: 'absolute' }}> {elements.overlay}</div>

                <div
                    className="paprize-page-component"
                    style={{ marginTop: 'auto' }}
                >
                    <div className="paprize-page-component">
                        {elements.footer}
                    </div>
                    {pageIndex == 0 && (
                        <div
                            className="paprize-page-component"
                            ref={sectionFooterRef}
                        >
                            {elements.sectionFooter}
                        </div>
                    )}
                </div>
            </div>
        </PageContext>
    );
}
