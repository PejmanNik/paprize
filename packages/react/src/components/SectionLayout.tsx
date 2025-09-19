import { createPortal } from 'react-dom';
import {
    tempContainerClassName,
    type PaginationConfig,
} from '@paprize/core/src';
import type { PageElements } from './parseSectionChildren';
import type { PageDimension, PageMargin } from './pageTypes';
import { Page } from './Page';
import { isDebugMode } from '@paprize/core/src';
import { usePagination } from './usePagination';

export interface SectionLayoutProps {
    elements: PageElements;
    dimensions: PageDimension;
    margin: PageMargin | undefined;
    config: Partial<PaginationConfig>;
}

export function SectionLayout({
    elements,
    dimensions,
    margin,
    config,
}: SectionLayoutProps) {
    const { results, pageRef, sectionHeaderRef, sectionFooterRef, contentRef } =
        usePagination(elements, dimensions, margin, config);

    if (results !== null) {
        return (
            <>
                {results.map((page, index) => (
                    <Page
                        key={index}
                        elements={{
                            ...elements,
                            content: (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: page,
                                    }}
                                />
                            ),
                        }}
                        dimensions={dimensions}
                        margin={margin}
                        pageNumber={index + 1}
                        totalPages={results.length}
                    />
                ))}
            </>
        );
    }

    const style: React.CSSProperties | undefined = isDebugMode()
        ? undefined
        : {
              visibility: 'hidden',
              position: 'absolute',
              left: '-9999px',
              top: '-9999px',
          };

    return createPortal(
        <div className={tempContainerClassName} style={style}>
            <Page
                elements={elements}
                dimensions={dimensions}
                margin={margin}
                pageNumber={1}
                totalPages={1}
                ref={pageRef}
                sectionHeaderRef={sectionHeaderRef}
                sectionFooterRef={sectionFooterRef}
                contentRef={contentRef}
            />
        </div>,
        document.body
    );
}
