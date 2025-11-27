import type { MatcherReturnType, Page, TestInfo } from '@playwright/test';
import * as PaprizeCore from '@paprize/core';
import * as PaprizeVanilla from '@paprize/vanilla';
import { render } from 'preact-render-to-string';
import { test as baseTest, expect as baseExpect } from '@playwright/test';
import type { VNode } from 'preact';
import { resultsContainerId, type CoreComponents } from './shared';

declare global {
    interface Window {
        paprize: {
            core: {
                lib: typeof PaprizeCore;
                report: PaprizeCore.ReportBuilder;
                addSection: (
                    options?: Partial<PaprizeCore.SectionOptions>,
                    components?: CoreComponents
                ) => void;
            };
            vanilla: {
                lib: typeof PaprizeVanilla;
                report: PaprizeVanilla.PaprizeReport;
            };
            react: {
                render(title: string): void;
            };
        };
    }
}

class CorePage {
    private _paprizePage: PaprizePage;
    public pageContentId = 'page-content';

    public constructor(paprizePage: PaprizePage) {
        this._paprizePage = paprizePage;
    }

    public async setup<P>(app: VNode<P>): Promise<void>;
    public async setup<P>(
        app: VNode<P>,
        customizeSections: (
            core: typeof window.paprize.core
        ) => void | Promise<void>
    ): Promise<void>;
    public async setup<P>(
        app: VNode<P>,
        customizeSections?: (
            core: typeof window.paprize.core
        ) => void | Promise<void>
    ): Promise<void> {
        await this._paprizePage.page.setContent(render(app));

        await this._paprizePage.init();

        if (customizeSections) {
            const fn = customizeSections.toString();
            await this._paprizePage.page.evaluate(
                `const func = (${fn}); func(window.paprize.core)`
            );
        } else {
            await this._paprizePage.page.evaluate(async () => {
                window.paprize.core.addSection();
            });
        }

        await this._paprizePage.page.evaluate(async () => {
            const report =
                await window.paprize.core.report.schedulePagination();
            await report.suspension;
        });
    }
}

class VanillaPage {
    private _paprizePage: PaprizePage;

    public constructor(paprizePage: PaprizePage) {
        this._paprizePage = paprizePage;
    }

    public async addSection(options: PaprizeCore.SectionOptions) {
        await this._paprizePage.page.evaluate(
            async ({ options }) => {
                window.paprize.vanilla.report.addSection(options);
            },
            { options }
        );
    }

    // public async AddEvent(name: keyof PaprizeVanilla.PaprizeReportEvents) {
    //     await this._paprizePage.page.evaluate(
    //         async ({ options }) => {
    //             window.paprize.vanilla.report.monitor.addEventListener(
    //                 name,
    //                 callback
    //             );
    //         },
    //         { options }
    //     );
    // }
}

export class PaprizePage {
    public readonly page: Page;
    private readonly _testInfo: TestInfo;

    public readonly core: CorePage;
    public readonly vanilla: VanillaPage;

    public constructor(page: Page, testInfo: TestInfo) {
        this.page = page;
        this._testInfo = testInfo;
        this.core = new CorePage(this);
        this.vanilla = new VanillaPage(this);
    }

    public get resultsLocator() {
        return this.page.locator(`#${resultsContainerId}`);
    }

    public get testSnapshotFile() {
        return `${this._testInfo.title.substring(0, 200)}_${this._testInfo.testId}.txt`;
    }

    public async init() {
        await this.page.addScriptTag({
            path: './dist/paprize.js',
            type: 'module',
        });

        await this.page.evaluate((resultsContainerId) => {
            const result = document.createElement('div');
            result.id = resultsContainerId;
            result.style.display = 'flex';
            result.style.flexDirection = 'column';
            result.style.gap = '20px';

            document.body.appendChild(result);
        }, resultsContainerId);

        await this.page.addStyleTag({
            content: `
            @import url('https://fonts.googleapis.com/css2?family=Inter:opsz@14..32&display=swap');
            html {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
            font-family: "Inter";
            font-optical-sizing: auto;
            font-style: normal;
            font-weight: 400;
            font-size: 14px;
            }
            p, span, div, li, th, td, a {
                line-height: 1.5 !important;
            }`,
        });

        await this.page.evaluate(() => document.fonts.ready);
    }
}

export const test = baseTest.extend<{ paprizePage: PaprizePage }>({
    paprizePage: async ({ page }, use, testInfo) => {
        const paprizePage = new PaprizePage(page, testInfo);

        try {
            await use(paprizePage);
        } finally {
            const screenshot = await paprizePage.resultsLocator.screenshot();
            await testInfo.attach('screenshot', {
                body: screenshot,
                contentType: 'image/png',
            });
        }
    },
});

export const expect = baseExpect.extend({
    async toMatchReportSnapshot(page: PaprizePage): Promise<MatcherReturnType> {
        const assertionName = 'toMatchReportSnapshot';
        const rawText = await page.resultsLocator.evaluate(
            (el) => el.innerHTML
        );

        try {
            baseExpect(rawText).toMatchSnapshot({
                name: page.testSnapshotFile,
            });

            return {
                pass: true,
                name: assertionName,
                message: () =>
                    this.utils.matcherHint(assertionName, undefined, undefined),
            };
        } catch (e: unknown) {
            if (e && typeof e === 'object' && 'matcherResult' in e) {
                const matcherResult = e.matcherResult as Omit<
                    MatcherReturnType,
                    'message'
                > & { message: string };
                return {
                    ...matcherResult,
                    message: () => matcherResult.message,
                };
            }
            throw e;
        }
    },
});
