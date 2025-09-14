import {
    defaultPlugins,
    isDebugMode,
    logger,
    Paginator,
    type PaginateResult,
} from '@paprize/core/src';
import {
    calculatePageDimensions,
    createSectionPageHeightPlugin,
} from './usePagination.utilities';
import { useContext, useEffect, useRef, useState } from 'react';
import type { PageElements } from './parseSectionChildren';
import type { PageDimension, PageMargin } from './pageTypes';
import type { SectionLayoutProps } from './SectionLayout';
import { SectionContext } from './SectionContext';
import type { PaginationConfig } from '@paprize/core/src';
import { useIsSectionSuspendedCallback } from './useIsSectionSuspendedCallback';
import { useSetSectionState } from './useSetSectionInfo';

const logPrefix = '\x1b[41mREACT\x1b[0m';

interface PaginationState {
    results: PaginateResult | null;
    isLoading: boolean;
}

const isCacheValid = (
    cache: SectionLayoutProps | null,
    elements: PageElements,
    dimensions: PageDimension,
    margin: PageMargin | undefined,
    config: PaginationConfig | undefined
) => {
    return (
        cache?.dimensions === dimensions &&
        cache?.margin === margin &&
        cache?.elements === elements &&
        cache?.config === config &&
        cache?.elements === elements
    );
};

export function usePagination(
    elements: PageElements,
    dimensions: PageDimension,
    margin: PageMargin | undefined,
    config: PaginationConfig | undefined
) {
    const sectionName = useContext(SectionContext);
    const readIsSectionSuspended = useIsSectionSuspendedCallback(sectionName);
    const setSectionInfo = useSetSectionState(sectionName);
    const cacheRef = useRef<SectionLayoutProps | null>(null);
    const [state, setState] = useState<PaginationState>({
        results: null,
        isLoading: true,
    });

    const pageRef = useRef<HTMLDivElement>(null);
    const sectionHeaderRef = useRef<HTMLDivElement>(null);
    const sectionFooterRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // reset state when dependencies change
    useEffect(() => {
        if (
            !isCacheValid(
                cacheRef.current,
                elements,
                dimensions,
                margin,
                config
            )
        ) {
            setState({
                results: null,
                isLoading: true,
            });
        }
    }, [dimensions, elements, margin, config]);

    // main pagination logic
    // the following condition will avoid infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        // early return if page ref isn't ready or cache is valid
        if (
            !pageRef.current ||
            !contentRef.current ||
            isCacheValid(cacheRef.current, elements, dimensions, margin, config)
        ) {
            return;
        }

        if (readIsSectionSuspended()) {
            logger.info(logPrefix, `Section "${sectionName}" is suspended`);
            return;
        }

        const { height, width, sectionFooterHeight, sectionHeaderHeight } =
            calculatePageDimensions(
                contentRef.current,
                sectionHeaderRef.current,
                sectionFooterRef.current
            );

        const plugins = config?.plugins.length
            ? config.plugins
            : [
                  ...defaultPlugins,
                  createSectionPageHeightPlugin(
                      height,
                      sectionHeaderHeight,
                      sectionFooterHeight
                  ),
              ];

        if (isDebugMode()) {
            pageRef.current.style.maxHeight = 'none';
            pageRef.current.style.height = 'auto';
        }

        logger.debug(logPrefix, 'Calling Paginator', {
            sectionName,
            height,
            width,
            sectionFooterHeight,
            sectionHeaderHeight,
            plugins,
        });

        const paginatorResult = Paginator.paginate(
            contentRef.current,
            { height, width },
            { ...config, plugins }
        );

        logger.debug(logPrefix, 'Paginator Result', {
            sectionName,
            paginatorResult,
        });

        setState({
            results: paginatorResult,
            isLoading: false,
        });

        setSectionInfo((pre) => ({
            ...pre,
            totalPages: paginatorResult.length,
            isPaginated: true,
        }));

        cacheRef.current = { elements, dimensions, margin, config };
    });

    return {
        ...state,
        pageRef,
        sectionHeaderRef,
        sectionFooterRef,
        contentRef,
    };
}
