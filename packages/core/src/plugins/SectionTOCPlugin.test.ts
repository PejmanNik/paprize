import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest';
import { SectionTocPlugin } from './SectionTocPlugin';
import type { PageElement } from '../paginate/PageNodes';
import type { PageManager } from '../paginate/PageManager';
import type { DomState } from '../paginate/DomState';

describe('SectionTocPlugin', () => {
    let plugin: SectionTocPlugin;
    let mockDomState: Mocked<DomState & { currentNode: PageElement }>;
    let mockPageManager: Mocked<PageManager>;
    let mockElement: HTMLElement;

    beforeEach(() => {
        plugin = new SectionTocPlugin();
        mockElement = document.createElement('h2');
        mockElement.textContent = 'Section Title';
        mockDomState = {
            currentNode: {
                getNode: vi.fn().mockReturnValue(mockElement),
            } as unknown as Mocked<PageElement>,
        } as unknown as Mocked<DomState & { currentNode: PageElement }>;
        mockPageManager = {
            getPageState: vi.fn().mockReturnValue({ pageIndex: 2 }),
        } as unknown as Mocked<PageManager>;
    });

    describe('onVisitElement', () => {
        it('should add section info for heading element', () => {
            plugin.onVisitElement('section-1', mockDomState, mockPageManager);
            expect(plugin.state).toHaveLength(1);
            expect(plugin.state[0]).toEqual({
                sectionId: 'section-1',
                pageNumber: 3,
                title: 'Section Title',
                level: 2,
            });
        });

        it('should not add section if not a heading', () => {
            mockElement = document.createElement('div');
            mockElement.textContent = 'Not a heading';
            (mockDomState.currentNode.getNode as any).mockReturnValue(
                mockElement
            );
            plugin.onVisitElement('section-2', mockDomState, mockPageManager);
            expect(plugin.state).toHaveLength(0);
        });

        it('should not add section if heading has no text', () => {
            mockElement = document.createElement('h3');
            mockElement.textContent = '';
            (mockDomState.currentNode.getNode as any).mockReturnValue(
                mockElement
            );
            plugin.onVisitElement('section-3', mockDomState, mockPageManager);
            expect(plugin.state).toHaveLength(0);
        });
    });

    describe('getHeadingLevel', () => {
        it('should return correct level for heading tags', () => {
            for (let i = 1; i <= 6; i++) {
                const el = document.createElement('h' + i);
                expect(plugin.getHeadingLevel(el as any)).toBe(i);
            }
        });
        it('should return null for non-heading tags', () => {
            const el = document.createElement('div');
            expect(plugin.getHeadingLevel(el as any)).toBeNull();
        });
    });
});
