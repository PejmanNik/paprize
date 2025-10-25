import { describe, it, expect, vi, beforeEach } from 'vitest';
import { debugPlugin } from './debugPlugin';
import { attributePrefix, pageClassName } from '../constants';
import type { PageManager } from '../paginate/PageManager';

describe('debugPlugin', () => {
    const id = 'id';
    let mockPageManager: PageManager;
    let mockPage: HTMLElement;

    beforeEach(() => {
        mockPage = document.createElement('div');
        mockPageManager = {
            getPageState: vi.fn().mockReturnValue({
                currentPage: { getNode: vi.fn().mockReturnValue(mockPage) },
                pageHeight: 1234,
            }),
        } as unknown as PageManager;
    });

    describe('onNewPage', () => {
        it('should add pz-page class if not present', () => {
            expect(mockPage.classList.contains(pageClassName)).toBe(false);
            debugPlugin.onNewPage!(id, mockPageManager);
            expect(mockPage.classList.contains(pageClassName)).toBe(true);
        });

        it('should not add pz-page class if already present', () => {
            mockPage.classList.add(pageClassName);
            debugPlugin.onNewPage!(id, mockPageManager);
            // Should still only be present once
            expect(
                Array.from(mockPage.classList).filter(
                    (c) => c === pageClassName
                ).length
            ).toBe(1);
        });

        it('should set debug attributes on the page', () => {
            debugPlugin.onNewPage!(id, mockPageManager);
            expect(mockPage.getAttribute(`${attributePrefix}-element`)).toBe(
                'page'
            );
            expect(mockPage.getAttribute(`${attributePrefix}-height`)).toBe(
                '1234'
            );
        });
    });
});
