import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TablePlugin } from './TablePlugin';
import type { PageElement } from '../paginate/PageNodes';

describe('TablePlugin', () => {
    const id = 'id';
    let mockElement: Element;
    let mockPageElement: PageElement;
    let mockOriginalTable: HTMLTableElement;
    let plugin: TablePlugin;

    beforeEach(() => {
        plugin = new TablePlugin();
        mockElement = document.createElement('table');
        mockPageElement = {
            config: {},
            clonedFrom: {} as PageElement,
            cloneCount: 2,
            transaction: {},
            getOriginalNode: vi.fn(),
            appendChild: vi.fn(),
        } as unknown as PageElement;

        mockOriginalTable = {
            tHead: {
                cloneNode: vi.fn().mockReturnValue({} as HTMLElement),
            } as unknown as HTMLTableSectionElement | null,
            tFoot: {
                cloneNode: vi.fn().mockReturnValue({} as HTMLElement),
            } as unknown as HTMLTableSectionElement | null,
        } as HTMLTableElement;
    });

    it('should set keepOnSamePage to true for TR elements', () => {
        const trElement = { tagName: 'TR' } as Element;
        const pageElement = { config: {} } as PageElement;

        plugin.onClone(id, trElement, pageElement);

        expect(pageElement.config.keepOnSamePage).toBe(true);
    });

    it('should return early for non TABLE/TR elements', () => {
        const divElement = { tagName: 'DIV' } as Element;

        plugin.onClone(id, divElement, mockPageElement);

        expect(mockPageElement.getOriginalNode).not.toHaveBeenCalled();
        expect(mockPageElement.appendChild).not.toHaveBeenCalled();
    });

    it('should return early when clonedFrom is null/undefined', () => {
        const tableElement = { tagName: 'TABLE' } as Element;
        const pageElement = {
            ...mockPageElement,
            clonedFrom: undefined,
        } as PageElement;

        plugin.onClone(id, tableElement, pageElement);

        expect(pageElement.getOriginalNode).not.toHaveBeenCalled();
        expect(pageElement.appendChild).not.toHaveBeenCalled();
    });

    it('should return early when cloneCount is 1', () => {
        const tableElement = { tagName: 'TABLE' } as Element;
        const pageElement = {
            ...mockPageElement,
            cloneCount: 1,
        } as PageElement;

        plugin.onClone(id, tableElement, pageElement);

        expect(pageElement.getOriginalNode).not.toHaveBeenCalled();
        expect(pageElement.appendChild).not.toHaveBeenCalled();
    });

    it('should clone header when cloneHeader option is true and table has tHead', () => {
        const plugin = new TablePlugin({ cloneHeader: true });
        mockPageElement.getOriginalNode = vi
            .fn()
            .mockReturnValue(mockOriginalTable);

        plugin.onClone(id, mockElement, mockPageElement);

        expect(mockPageElement.getOriginalNode).toHaveBeenCalled();
        expect(mockOriginalTable.tHead!.cloneNode).toHaveBeenCalledWith(true);
        expect(mockPageElement.appendChild).toHaveBeenCalledTimes(1);
    });

    it.for([undefined, false])(
        'should not clone header when cloneHeader option is false/undefined',
        (value) => {
            const plugin = new TablePlugin({ cloneHeader: value });
            mockPageElement.getOriginalNode = vi
                .fn()
                .mockReturnValue(mockOriginalTable);

            plugin.onClone(id, mockElement, mockPageElement);

            expect(mockOriginalTable.tHead!.cloneNode).not.toHaveBeenCalled();
        }
    );

    it('should clone footer when cloneFooter option is true and table has tFoot', () => {
        const plugin = new TablePlugin({ cloneFooter: true });
        mockPageElement.getOriginalNode = vi
            .fn()
            .mockReturnValue(mockOriginalTable);

        plugin.onClone(id, mockElement, mockPageElement);

        expect(mockPageElement.getOriginalNode).toHaveBeenCalled();
        expect(mockOriginalTable.tFoot!.cloneNode).toHaveBeenCalledWith(true);
        expect(mockPageElement.appendChild).toHaveBeenCalledTimes(1);
    });

    it.for([undefined, false])(
        'should not clone footer when cloneFooter option is false/undefined',
        (value) => {
            const plugin = new TablePlugin({ cloneFooter: value });
            mockPageElement.getOriginalNode = vi
                .fn()
                .mockReturnValue(mockOriginalTable);

            plugin.onClone(id, mockElement, mockPageElement);

            expect(mockOriginalTable.tFoot!.cloneNode).not.toHaveBeenCalled();
        }
    );

    it('should clone both header and footer when both options are true', () => {
        const plugin = new TablePlugin({
            cloneHeader: true,
            cloneFooter: true,
        });
        mockPageElement.getOriginalNode = vi
            .fn()
            .mockReturnValue(mockOriginalTable);

        plugin.onClone(id, mockElement, mockPageElement);

        expect(mockOriginalTable.tHead!.cloneNode).toHaveBeenCalledWith(true);
        expect(mockOriginalTable.tFoot!.cloneNode).toHaveBeenCalledWith(true);
        expect(mockPageElement.appendChild).toHaveBeenCalledTimes(2);
    });

    it('should handle table without tHead when cloneHeader is true', () => {
        const plugin = new TablePlugin({ cloneHeader: true });
        const tableWithoutHead = { ...mockOriginalTable, tHead: null };
        mockPageElement.getOriginalNode = vi
            .fn()
            .mockReturnValue(tableWithoutHead);

        plugin.onClone(id, mockElement, mockPageElement);

        expect(mockPageElement.appendChild).not.toHaveBeenCalled();
    });

    it('should handle table without tFoot when cloneFooter is true', () => {
        const plugin = new TablePlugin({ cloneFooter: true });
        const tableWithoutFoot = { ...mockOriginalTable, tFoot: null };
        mockPageElement.getOriginalNode = vi
            .fn()
            .mockReturnValue(tableWithoutFoot);

        plugin.onClone(id, mockElement, mockPageElement);

        expect(mockPageElement.appendChild).not.toHaveBeenCalled();
    });

    it('should create PageElement instances with correct parameters when cloning', () => {
        const plugin = new TablePlugin({
            cloneHeader: true,
            cloneFooter: true,
        });

        mockPageElement.getOriginalNode = vi
            .fn()
            .mockReturnValue(mockOriginalTable);

        plugin.onClone(id, mockElement, mockPageElement);

        expect(mockPageElement.appendChild).toHaveBeenCalledWith(
            expect.objectContaining({
                config: mockPageElement.config,
                transaction: mockPageElement.transaction,
            })
        );
    });
});
