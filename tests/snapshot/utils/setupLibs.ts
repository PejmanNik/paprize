import * as PaprizeCore from '@paprize/core';
import * as PaprizeVanilla from '@paprize/vanilla';
import {
    resultsContainerId,
    pageContentId,
    type CoreComponents,
    sectionId,
    pageSize,
} from './shared';

const coreReport = new PaprizeCore.ReportBuilder();

window.paprize = {
    core: {
        lib: PaprizeCore,
        report: coreReport,
        addSection: (
            options?: Partial<PaprizeCore.SectionOptions>,
            components?: CoreComponents
        ) => {
            const pageContent = components?.pageContentId
                ? document.getElementById(components.pageContentId)
                : document.getElementById(pageContentId);
            if (!pageContent) {
                throw new Error('Page content element not found');
            }

            return coreReport.tryAddSection(
                {
                    id: sectionId,
                    size: pageSize.small,
                    ...options,
                },
                {
                    pageFooter: document.getElementById(
                        components?.pageFooterId ?? ''
                    ),
                    sectionFooter: document.getElementById(
                        components?.sectionFooterId ?? ''
                    ),
                    pageHeader: document.getElementById(
                        components?.pageHeaderId ?? ''
                    ),
                    sectionHeader: document.getElementById(
                        components?.sectionHeaderId ?? ''
                    ),
                    pageContent: pageContent,
                },
                (context: PaprizeCore.SectionContext) => {
                    const resultsContainer =
                        document.getElementById(resultsContainerId);

                    if (!resultsContainer) {
                        throw new Error('Results container not found');
                    }

                    for (const pageContext of context.pages) {
                        const pageWrapper = document.createElement('div');
                        pageWrapper.style.display = 'flex';
                        pageWrapper.style.flexDirection = 'column';

                        const pageElement = document.createElement('div');
                        pageElement.innerHTML = pageContext.pageContentHtml;
                        pageElement.style.boxShadow = '0 0 0 2px black';
                        pageElement.style.maxHeight =
                            context.options.size.height;
                        pageElement.style.maxWidth = context.options.size.width;
                        pageWrapper.appendChild(pageElement);

                        resultsContainer.appendChild(pageWrapper);

                        const pageRect = pageElement.getBoundingClientRect();
                        const pageInfo = document.createElement('small');
                        pageInfo.innerText = `${pageContext.pageIndex + 1}/${pageContext.totalPages}|${Math.ceil(pageRect.width)}*${Math.ceil(pageRect.height)}`;
                        pageWrapper.appendChild(pageInfo);

                        // after printing actual size of page
                        pageElement.style.height = context.options.size.height;
                        pageElement.style.width = context.options.size.width;
                    }
                }
            );
        },
    },
    vanilla: {
        lib: PaprizeVanilla,
        report: new PaprizeVanilla.PaprizeReport(),
    },
    react: {
        render: (title: string) => {
            console.log('render', title);
        },
    },
};
