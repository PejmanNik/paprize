import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ReportBuilder, type SectionOptions } from './ReportBuilder';
import { Paginator } from '../paginate/Paginator';
import { paprize_isInitialized } from '../window';
import type { SectionComponents } from './sectionComponents';
import { globalStyleId } from '../constants';

vi.mock('../paginate/Paginator', () => {
    const paginate = vi.fn();
    return { Paginator: { paginate } };
});

vi.mock('./utils', async () => {
    const original = await vi.importActual('./utils');

    return {
        ...original,
        calculatePageDimensions: vi.fn().mockReturnValue({
            height: 100,
            width: 200,
            sectionHeaderHeight: 10,
            sectionFooterHeight: 5,
        }),
        createSectionPageHeightPlugin: vi.fn().mockReturnValue({}),
    };
});

describe('ReportBuilder', () => {
    let rb: ReportBuilder;
    const options = {
        id: 'sec1',
        dimension: { width: 100, height: 200 },
    } as unknown as SectionOptions;

    beforeEach(() => {
        vi.clearAllMocks();
        rb = new ReportBuilder();
        Object.defineProperty(document, 'fonts', {
            configurable: true,
            value: { ready: Promise.resolve() },
        });

        document.body.innerHTML = '';
    });

    it.for([true, false])(
        'tryAddSection should add a section and dispatch sectionCreated',
        (withsuspense) => {
            const sectionCreated = vi.fn();
            rb.monitor.addEventListener('sectionCreated', sectionCreated);

            const pageContent = document.createElement('div');
            pageContent.id = 'pageContent';

            const components: SectionComponents = {
                sectionHeader: null,
                sectionFooter: null,
                pageHeader: null,
                pageFooter: null,
                pageContent,
            };

            const testOptions = {
                ...options,
                suspense: withsuspense ? [Promise.resolve()] : [],
            };

            const added = rb.tryAddSection(testOptions, components, () => {});
            expect(added).toBe(true);

            expect(sectionCreated).toHaveBeenCalled();
            const eventArg = sectionCreated.mock.calls[0][0];
            expect(eventArg.sectionId).toBe('sec1');
            expect(eventArg.index).toBe(0);
            expect(eventArg.pages).toEqual([]);
            expect(eventArg.isSuspended).toEqual(withsuspense);
        }
    );

    it('tryAddSection should return false if section id already exists', () => {
        const pageContent = document.createElement('div');
        const components = {
            sectionHeader: null,
            sectionFooter: null,
            pageHeader: null,
            pageFooter: null,
            pageContent,
        };
        rb.tryAddSection(options, components, () => {});
        const result = rb.tryAddSection(options, components, () => {});
        expect(result).toBe(false);
    });

    it('paginate should call Paginator.paginate and dispatch lifecycle events', async () => {
        const paginateMock = vi.mocked(Paginator.paginate);
        paginateMock.mockReturnValue(['<div>page1</div>', '<div>page2</div>']);

        const pageCompleted = vi.fn();
        const sectionCompleted = vi.fn();
        const paginationCycleCompleted = vi.fn();

        rb.monitor.addEventListener('pageCompleted', pageCompleted);
        rb.monitor.addEventListener('sectionCompleted', sectionCompleted);
        rb.monitor.addEventListener(
            'paginationCycleCompleted',
            paginationCycleCompleted
        );

        const pageContent = document.createElement('div');
        pageContent.id = 'pageContent2';

        const components: SectionComponents = {
            sectionHeader: null,
            sectionFooter: null,
            pageHeader: null,
            pageFooter: null,
            pageContent,
        };

        const onPaginationCompleted = vi.fn();

        const added = rb.tryAddSection(
            options,
            components,
            onPaginationCompleted
        );
        expect(added).toBe(true);

        await rb.schedulePaginate();

        // paginate should have been called with the cloned pageContent and page size
        expect(paginateMock).toHaveBeenCalled();

        // onPaginationCompleted should be called with page contexts
        expect(onPaginationCompleted).toHaveBeenCalled();
        const pagesArg = onPaginationCompleted.mock.calls[0][0];
        expect(Array.isArray(pagesArg)).toBe(true);
        expect(pagesArg.length).toBe(2);
        expect(pagesArg[0].pageContentHtml).toBe('<div>page1</div>');

        // events should be dispatched for pages and section and pagination cycle
        expect(pageCompleted).toHaveBeenCalledTimes(2);
        expect(sectionCompleted).toHaveBeenCalled();
        expect(paginationCycleCompleted).toHaveBeenCalled();
    });

    it('paginate should call Paginator.paginate after suspense resolved', async () => {
        const paginateMock = vi.mocked(Paginator.paginate);
        paginateMock.mockReturnValue(['<div>page1</div>']);

        const pageContent = document.createElement('div');
        const components: SectionComponents = {
            sectionHeader: null,
            sectionFooter: null,
            pageHeader: null,
            pageFooter: null,
            pageContent,
        };

        const onPaginationCompleted = vi.fn();

        const sectionCompleted = vi.fn();
        rb.monitor.addEventListener('sectionCompleted', sectionCompleted);

        let resolve: () => void;
        const suspense = new Promise<void>((res) => {
            resolve = res;
        });

        const section1 = 'se1';
        const section2 = 'se2';

        rb.tryAddSection(
            {
                ...options,
                id: section1,
                suspense: [suspense],
            },
            components,
            onPaginationCompleted
        );
        const added = rb.tryAddSection(
            {
                ...options,
                id: section2,
            },
            components,
            onPaginationCompleted
        );

        expect(added).toBe(true);

        const result = await rb.schedulePaginate();

        expect(result.sections.length).toBe(2);
        expect(result.sections[0].isSuspended).toBe(true);
        expect(result.sections[1].isSuspended).toBe(false);

        expect(sectionCompleted).toHaveBeenCalledWith(
            expect.objectContaining({ sectionId: section2 })
        );
        expect(sectionCompleted).not.toHaveBeenCalledWith(
            expect.objectContaining({ sectionId: section1 })
        );

        resolve!();
        await result.suspension;

        expect(sectionCompleted).toHaveBeenCalledWith(
            expect.objectContaining({ sectionId: section1 })
        );
    });

    it('paginateSection should append all section/page headers and footers if present', async () => {
        const sectionHeader = document.createElement('div');
        sectionHeader.id = 'sectionHeader';
        const sectionFooter = document.createElement('div');
        sectionFooter.id = 'sectionFooter';
        const pageHeader = document.createElement('div');
        pageHeader.id = 'pageHeader';
        const pageFooter = document.createElement('div');
        pageFooter.id = 'pageFooter';
        const pageContent = document.createElement('div');
        pageContent.id = 'pageContentAll';

        const components: SectionComponents = {
            sectionHeader,
            sectionFooter,
            pageHeader,
            pageFooter,
            pageContent,
        };

        const onPaginationCompleted = vi.fn();
        rb.tryAddSection(options, components, onPaginationCompleted);
        await rb.schedulePaginate();

        expect(document.body.innerHTML).toContain('sectionHeader');
        expect(document.body.innerHTML).toContain('sectionFooter');
        expect(document.body.innerHTML).toContain('pageHeader');
        expect(document.body.innerHTML).toContain('pageFooter');
        expect(document.body.innerHTML).toContain('pageContentAll');
    });
});

describe('ReportBuilder constructor', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        document.head.innerHTML = '';
        document.body.innerHTML = '';
    });

    it('constructor should set window initialization flag', () => {
        delete (window as any)[paprize_isInitialized];
        expect((window as any)[paprize_isInitialized]).toBeUndefined();

        new ReportBuilder();

        expect((window as any)[paprize_isInitialized]).toBe(true);
    });

    it('constructor should set window initialization flag', () => {
        new ReportBuilder();

        expect(document.head.querySelector('style')?.id).toContain(
            globalStyleId
        );
    });
});
