import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest';
import {
    getVisibleSize,
    calculatePageSizes,
    createSectionPageHeightPlugin,
    shorthand,
    jsonDataReader,
    lazyPromise,
} from './utils';
import * as DomUtilities from '../paginate/domUtilities';
import type { PageManager, PageState } from '../paginate/PageManager';
import type { DomState } from '../paginate/DomState';
import { SplitResult } from '../paginate/SplitResult';
import { paprize_readJsonDataFile } from '../window';

vi.mock('../paginate/domUtilities');
vi.mock('../debugUtilities/debugMode');

describe('getVisibleSize', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns correct width and height including margins', () => {
        const el = document.createElement('div');
        el.style.width = '100px';
        el.style.height = '50px';
        el.style.marginLeft = '10px';
        el.style.marginRight = '5px';
        document.body.appendChild(el);

        vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
            width: 100,
            height: 50,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            x: 0,
            y: 0,
            toJSON: () => {},
        });

        vi.spyOn(DomUtilities, 'getVisibleHeight').mockReturnValue(50);

        const result = getVisibleSize(el);
        expect(result.width).toBe(115); // 100 + 10 + 5
        expect(result.height).toBe(50);
    });
});

describe('calculatePageSizes', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns correct sizes and header/footer heights', () => {
        const content = document.createElement('div');
        const header = document.createElement('div');
        const footer = document.createElement('div');
        vi.spyOn(DomUtilities, 'getVisibleHeight').mockImplementation((el) => {
            if (el === content) return 100;
            if (el === header) return 10;
            if (el === footer) return 20;
            return 0;
        });

        vi.spyOn(content, 'getBoundingClientRect').mockReturnValue({
            width: 200,
            height: 100,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            x: 0,
            y: 0,
            toJSON: () => {},
        });
        content.style.marginLeft = '0px';
        content.style.marginRight = '0px';
        const result = calculatePageSizes(content, header, footer);

        expect(result.height).toBe(100);
        expect(result.width).toBe(200);
        expect(result.sectionHeaderHeight).toBe(10);
        expect(result.sectionFooterHeight).toBe(20);
    });

    it('returns 0 for header/footer heights when they are null', () => {
        const content = document.createElement('div');
        vi.spyOn(DomUtilities, 'getVisibleHeight').mockImplementation(() => {
            return 150;
        });

        vi.spyOn(content, 'getBoundingClientRect').mockReturnValue({
            width: 300,
            height: 150,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            x: 0,
            y: 0,
            toJSON: () => {},
        });

        const result = calculatePageSizes(content, null, null);

        expect(result.height).toBe(150);
        expect(result.width).toBe(300);
        expect(result.sectionHeaderHeight).toBe(0);
        expect(result.sectionFooterHeight).toBe(0);
    });
});

describe('createSectionPageHeightPlugin', () => {
    const id = 'id';

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('onNewPage sets correct pageHeight for first and subsequent pages', () => {
        const plugin = createSectionPageHeightPlugin(100, 10, 20);
        const pageState = {
            pageIndex: 0,
            pageHeight: 0,
        } as unknown as PageState;
        const pageManager = {
            getPageState: vi.fn().mockReturnValue(pageState),
        } as unknown as Mocked<PageManager>;

        expect(plugin.onNewPage).not.toBeNull();

        plugin.onNewPage!(id, pageManager);
        expect(pageManager.getPageState().pageHeight).toBe(120);

        pageState.pageIndex = 1;
        pageState.pageHeight = 0;
        plugin.onNewPage!(id, pageManager);

        expect(pageManager.getPageState().pageHeight).toBe(130);
    });

    it('afterVisitNode returns early when there is no last page or footer height is <= 0', () => {
        const plugin = createSectionPageHeightPlugin(100, 10, 20);
        const pageManager = {
            hasEmptySpace: vi.fn(),
            nextPage: vi.fn(),
        } as unknown as Mocked<PageManager>;
        const domState1 = { completed: null } as unknown as DomState;

        // no last page -> should return early and not call pageManager
        plugin.afterVisitNode!('id', SplitResult.None, domState1, pageManager);
        expect(pageManager.hasEmptySpace).not.toHaveBeenCalled();
        expect(pageManager.nextPage).not.toHaveBeenCalled();

        // footer height <= 0 -> should return early even if last page exists
        const pluginNoFooter = createSectionPageHeightPlugin(100, 10, 0);
        const pm2 = {
            hasEmptySpace: vi.fn(),
            nextPage: vi.fn(),
        } as unknown as Mocked<PageManager>;
        const domState2 = { completed: {} } as unknown as DomState;

        pluginNoFooter.afterVisitNode!('id', SplitResult.None, domState2, pm2);
        expect(pm2.hasEmptySpace).not.toHaveBeenCalled();
        expect(pm2.nextPage).not.toHaveBeenCalled();
    });

    it('afterVisitNode calls nextPage when there is not enough empty space', () => {
        const plugin = createSectionPageHeightPlugin(100, 10, 20);
        const pageManager = {
            hasEmptySpace: vi.fn().mockReturnValue(false),
            nextPage: vi.fn(),
        } as unknown as Mocked<PageManager>;
        const domState = { completed: {} } as unknown as DomState;

        plugin.afterVisitNode!('id', SplitResult.None, domState, pageManager);

        expect(pageManager.hasEmptySpace).toHaveBeenCalledWith(20);
        expect(pageManager.nextPage).toHaveBeenCalled();
    });

    it('afterVisitNode does not call nextPage when there is enough empty space', () => {
        const plugin = createSectionPageHeightPlugin(100, 10, 20);
        const pageManager = {
            hasEmptySpace: vi.fn().mockReturnValue(true),
            nextPage: vi.fn(),
        } as unknown as Mocked<PageManager>;
        const domState = { completed: {} } as unknown as DomState;
        plugin.afterVisitNode!('id', SplitResult.None, domState, pageManager);

        expect(pageManager.hasEmptySpace).toHaveBeenCalledWith(20);
        expect(pageManager.nextPage).not.toHaveBeenCalled();
    });
});

describe('shorthand', () => {
    it('returns correct shorthand string for margin', () => {
        expect(
            shorthand({ top: '1px', right: '2px', bottom: '3px', left: '4px' })
        ).toBe('1px 2px 3px 4px');
    });
    it('returns 0 if margin is undefined', () => {
        expect(shorthand()).toBe('0');
    });
});

describe('jsonDataReader', () => {
    it('returns null when not available', async () => {
        delete window[paprize_readJsonDataFile];

        const reader = await jsonDataReader();
        expect(reader).toBe(null);
    });
    it('returns JSON value when available', async () => {
        const data = {
            x: 1,
            y: 'a',
        };
        window[paprize_readJsonDataFile] = () =>
            Promise.resolve(JSON.stringify(data));

        const result = await jsonDataReader();

        expect(result).toMatchObject(data);
    });
    it('returns null value injected data is empty', async () => {
        window[paprize_readJsonDataFile] = () => Promise.resolve('');

        const result = await jsonDataReader();

        expect(result).toBeNull();
    });
});

describe('lazyPromise', () => {
    it('should call factory only once on multiple invocations', async () => {
        const factory = vi.fn().mockResolvedValue('result');
        const lazy = lazyPromise(factory);

        await lazy();
        await lazy();
        await lazy();

        expect(factory).toHaveBeenCalledTimes(1);
    });

    it('should return the same promise instance on multiple calls', () => {
        const factory = vi.fn().mockResolvedValue('result');
        const lazy = lazyPromise(factory);

        const promise1 = lazy();
        const promise2 = lazy();
        const promise3 = lazy();

        expect(promise1).toBe(promise2);
        expect(promise2).toBe(promise3);
    });

    it('should not call factory until first invocation', () => {
        const factory = vi.fn().mockResolvedValue('result');
        lazyPromise(factory);

        expect(factory).not.toHaveBeenCalled();
    });
});
