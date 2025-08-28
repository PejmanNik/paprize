import { describe, it, expect, vi, beforeEach } from 'vitest';
import { callPluginHook } from './PaginationPlugin';
import type { PaginationPlugin, VisitContext } from './PaginationPlugin';
import type { PageManager } from './PageManager';
import type { PageText } from './PageNodes';

describe('callPluginHook', () => {
    let mockText: PageText;
    let mockPageManager: PageManager;
    let mockContext: VisitContext;

    beforeEach(() => {
        mockText = {} as PageText;
        mockPageManager = {} as PageManager;
        mockContext = {};
    });

    it('should call the specified hook on all plugins that have it', () => {
        const mockPlugin1: PaginationPlugin = {
            name: 'plugin1',
            onVisitText: vi.fn(),
        };

        const mockPlugin2: PaginationPlugin = {
            name: 'plugin2',
            onVisitText: vi.fn(),
        };

        const plugins = [mockPlugin1, mockPlugin2];

        callPluginHook(
            plugins,
            'onVisitText',
            mockText,
            mockPageManager,
            mockContext
        );

        expect(mockPlugin1.onVisitText).toHaveBeenCalledWith(
            mockText,
            mockPageManager,
            mockContext
        );
        expect(mockPlugin2.onVisitText).toHaveBeenCalledWith(
            mockText,
            mockPageManager,
            mockContext
        );
    });

    it('should skip plugins that do not have the specified hook', () => {
        const mockPlugin1: PaginationPlugin = {
            name: 'plugin1',
            onVisitText: vi.fn(),
        };

        const mockPlugin2: PaginationPlugin = {
            name: 'plugin2',
            // no onVisitText hook
        };

        const plugins = [mockPlugin1, mockPlugin2];
        const mockText = {} as PageText;
        const mockPageManager = {} as PageManager;
        const mockContext: VisitContext = {};

        callPluginHook(
            plugins,
            'onVisitText',
            mockText,
            mockPageManager,
            mockContext
        );

        expect(mockPlugin1.onVisitText).toHaveBeenCalledWith(
            mockText,
            mockPageManager,
            mockContext
        );
        // plugin2 should not throw an error
    });

    it('should handle errors in plugin hooks', () => {
        const error = new Error('Plugin error');
        const mockPlugin: PaginationPlugin = {
            name: 'errorPlugin',
            onVisitText: vi.fn().mockImplementation(() => {
                throw error;
            }),
        };

        const plugins = [mockPlugin];
        const mockText = {} as PageText;
        const mockPageManager = {} as PageManager;
        const mockContext: VisitContext = {};

        callPluginHook(
            plugins,
            'onVisitText',
            mockText,
            mockPageManager,
            mockContext
        );

        // no error thrown
    });
});
