import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest';
import { callPluginHook } from './PaginationPlugin';
import type { PaginationPlugin, VisitContext } from './PaginationPlugin';
import type { PageManager } from './PageManager';
import type { PageText } from './PageNodes';
import type { DomState } from './DomState';

describe('callPluginHook', () => {
    const id = 'default';
    let mockDomState: Mocked<DomState & { currentNode: PageText }>;
    let mockPageManager: PageManager;
    let context: VisitContext;

    beforeEach(() => {
        mockDomState = {
            currentNode: {} as PageText,
        } as unknown as Mocked<DomState & { currentNode: PageText }>;
        mockPageManager = {} as PageManager;
        context = {};
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
            id,
            mockDomState,
            mockPageManager,
            context
        );

        expect(mockPlugin1.onVisitText).toHaveBeenCalledWith(
            id,
            mockDomState,
            mockPageManager,
            context
        );
        expect(mockPlugin2.onVisitText).toHaveBeenCalledWith(
            id,
            mockDomState,
            mockPageManager,
            context
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

        callPluginHook(
            plugins,
            'onVisitText',
            id,
            mockDomState,
            mockPageManager,
            context
        );

        expect(mockPlugin1.onVisitText).toHaveBeenCalledWith(
            id,
            mockDomState,
            mockPageManager,
            context
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

        callPluginHook(
            plugins,
            'onVisitText',
            id,
            mockDomState,
            mockPageManager,
            context
        );

        // no error thrown
    });
});
