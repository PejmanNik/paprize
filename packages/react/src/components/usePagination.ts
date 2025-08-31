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
} from './Section.utilities';
import { use, useEffect, useRef, useState } from 'react';
import type { PageElements } from './parseSectionChildren';
import type { PageDimension, PageMargin } from './pageTypes';
import type { SectionLayoutProps } from './SectionLayout';
import { useSetAtom } from 'jotai';
import { reportInfo } from './reportInfo';
import { SectionContext } from './SectionContext';
import type { PaginationConfig } from '@paprize/core/src';

const logPrefix = '\x1b[41mREACT\x1b[0m';

interface PaginationState {
    results: PaginateResult | null;
    isLoading: boolean;
}

const isCacheValid = (
    cache: SectionLayoutProps | null,
    elements: PageElements,
    dimensions: PageDimension,
    margin?: PageMargin,
    options?: PaginationConfig
) => {
    return (
        cache?.dimensions === dimensions &&
        cache?.margin === margin &&
        cache?.elements === elements &&
        cache?.options === options &&
        cache?.elements === elements
    );
};

export function usePagination(
    elements: PageElements,
    dimensions: PageDimension,
    margin?: PageMargin,
    options?: PaginationConfig
) {
    const sectionName = use(SectionContext);
    const setReportInfo = useSetAtom(reportInfo);
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
        if (!isCacheValid(cacheRef.current, elements, dimensions, margin)) {
            setState({
                results: null,
                isLoading: true,
            });
        }
    }, [dimensions, elements, margin]);

    // main pagination logic
    // the following condition will avoid infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        const refs = {
            page: pageRef.current,
            sectionHeader: sectionHeaderRef.current,
            sectionFooter: sectionFooterRef.current,
            content: contentRef.current,
        };

        // early return if refs aren't ready or cache is valid
        if (
            !Object.values(refs).every((x) => x) ||
            isCacheValid(cacheRef.current, elements, dimensions, margin)
        ) {
            return;
        }

        const { height, width, heightWithoutSection } = calculatePageDimensions(
            refs.content!,
            refs.sectionHeader!,
            refs.sectionFooter!
        );

        const plugins = options?.plugins.length
            ? options.plugins
            : [
                  ...defaultPlugins,
                  createSectionPageHeightPlugin(height, heightWithoutSection),
              ];

        if (isDebugMode() && refs.page) {
            refs.page.style.maxHeight = 'none';
            refs.page.style.height = 'auto';
        }

        logger.debug(logPrefix, 'Calling Paginator', {
            height,
            heightWithoutSection,
            plugins,
        });

        const paginatorResult = Paginator.paginate(
            refs.content!,
            { height: heightWithoutSection, width },
            { ...options, plugins }
        );

        logger.debug(logPrefix, 'Paginator Result', {
            paginatorResult,
        });

        setState({
            results: paginatorResult,
            isLoading: false,
        });

        setReportInfo((pre) =>
            new Map(pre).set(sectionName, {
                totalPages: paginatorResult.length,
            })
        );

        cacheRef.current = { elements, dimensions, margin };
    });

    return {
        ...state,
        pageRef,
        sectionHeaderRef,
        sectionFooterRef,
        contentRef,
    };
}
