import { PaprizeReport, sectionAttribute } from '@paprize/vanilla';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    sectionPageHeightAttribute,
    sectionPageMarginAttribute,
    sectionPageOrientationAttribute,
    sectionPageSizeAttribute,
    sectionPageWidthAttribute,
    runZeroReport,
} from './zeroReportUtils';

const mockAddSection = vi.fn();
const mockSchedulePagination = vi.fn();

vi.mock('@paprize/vanilla', () => {
    return {
        sectionAttribute: 'data-pz-section',
        PaprizeReport: vi.fn(),
    };
});

describe('zeroReport', () => {
    beforeEach(() => {
        vi.mocked(PaprizeReport).mockImplementation(
            () =>
                ({
                    addSection: mockAddSection,
                    schedulePagination: mockSchedulePagination,
                }) as unknown as PaprizeReport
        );
    });

    it('should add sections for elements with sectionAttribute', async () => {
        document.body.innerHTML = `
            <div ${sectionAttribute} id="s1">Section 1</div>
            <div ${sectionAttribute} id="s2">Section 2</div>
        `;

        await runZeroReport();

        expect(mockAddSection).toHaveBeenCalledTimes(2);
        expect(mockAddSection).toHaveBeenCalledWith(
            expect.objectContaining({ id: 's1' })
        );
        expect(mockAddSection).toHaveBeenCalledWith(
            expect.objectContaining({ id: 's2' })
        );
        expect(mockSchedulePagination).toHaveBeenCalledTimes(1);
    });

    it('should parse page size attribute', async () => {
        document.body.innerHTML = `
            <div ${sectionAttribute} ${sectionPageSizeAttribute}="A5">Section</div>
        `;

        await import('./zeroReport');

        expect(mockAddSection).toHaveBeenCalledWith(
            expect.objectContaining({
                size: expect.objectContaining({
                    width: '148mm',
                    height: '210mm',
                }),
            })
        );
    });

    it('should parse custom width and height', async () => {
        document.body.innerHTML = `
            <div ${sectionAttribute} 
                 ${sectionPageSizeAttribute}="A5"
                 ${sectionPageWidthAttribute}="100mm" 
                 ${sectionPageHeightAttribute}="200mm">Section</div>
        `;

        await runZeroReport();

        expect(mockAddSection).toHaveBeenCalledWith(
            expect.objectContaining({
                size: { width: '100mm', height: '200mm' },
            })
        );
    });

    it('should parse margin attribute', async () => {
        document.body.innerHTML = `
            <div ${sectionAttribute} ${sectionPageMarginAttribute}="Normal">Section</div>
        `;

        await runZeroReport();

        expect(mockAddSection).toHaveBeenCalledWith(
            expect.objectContaining({
                margin: expect.objectContaining({ top: '1in' }),
            })
        );
    });

    it('should parse orientation attribute', async () => {
        document.body.innerHTML = `
            <div ${sectionAttribute} ${sectionPageSizeAttribute}="A5" ${sectionPageOrientationAttribute}="landscape">Section</div>
        `;

        await runZeroReport();

        expect(mockAddSection).toHaveBeenCalledWith(
            expect.objectContaining({
                size: expect.objectContaining({
                    width: '210mm',
                    height: '148mm',
                }),
            })
        );
    });

    it('should default to A4 size if attribute is missing or invalid', async () => {
        document.body.innerHTML = `
            <div ${sectionAttribute}>Section</div>
        `;

        await runZeroReport();

        expect(mockAddSection).toHaveBeenCalledWith(
            expect.objectContaining({
                size: expect.objectContaining({
                    width: '210mm',
                    height: '297mm',
                }),
            })
        );
    });

    it('should default to Narrow margin if attribute is missing or invalid', async () => {
        document.body.innerHTML = `
            <div ${sectionAttribute}>Section</div>
        `;

        await runZeroReport();

        expect(mockAddSection).toHaveBeenCalledWith(
            expect.objectContaining({
                margin: expect.objectContaining({ top: '0.4in' }),
            })
        );
    });
});
