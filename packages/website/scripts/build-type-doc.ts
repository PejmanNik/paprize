import * as TypeDoc from 'typedoc';
import type { PluginOptions } from 'typedoc-plugin-markdown';
import fs from 'fs/promises';
import { resolve } from 'path';

export async function buildTypeDoc(dirname: string) {
    const tempDit = resolve(dirname, 'temp_doc');
    await fs.rm(tempDit, { force: true, recursive: true });
    await fs.mkdir(tempDit);

    const settings: PluginOptions & TypeDoc.TypeDocOptions = {
        entryPoints: ['../core', '../vanilla', '../react', '../puppeteer'],
        tsconfig: '../../tsconfig.json',
        out: tempDit,
        entryPointStrategy: 'packages',
        plugin: [
            'typedoc-plugin-markdown',
            'typedoc-plugin-frontmatter',
            resolve(dirname, 'typedoc-custom.mjs'),
        ],
        excludeGroups: true,
        readme: 'none',
        mergeReadme: false,
        useCodeBlocks: false,
        router: 'module',
        gitRevision: 'main',
        parametersFormat: 'table',
        enumMembersFormat: 'table',
        propertyMembersFormat: 'table',
        interfacePropertiesFormat: 'table',
        typeAliasPropertiesFormat: 'table',
        typeDeclarationFormat: 'table',
        tableColumnSettings: {
            hideSources: true,
            hideModifiers: true,
            hideInherited: true,
        },
        headings: {
            readme: false,
        },
        hideBreadcrumbs: true,
        hidePageHeader: true,
        entryFileName: 'index.md',
    };

    const app = await TypeDoc.Application.bootstrapWithPlugins(settings);

    const project = await app.convert();
    if (project) {
        await app.generateOutputs(project);
    }

    fs.copyFile(
        resolve(tempDit, '@paprize', 'core.md'),
        resolve('./docs/core/api.md')
    );
    fs.copyFile(
        resolve(tempDit, '@paprize', 'vanilla.md'),
        resolve('./docs/vanilla/api.md')
    );
    fs.copyFile(
        resolve(tempDit, '@paprize', 'react.md'),
        resolve('./docs/react/api.md')
    );
    fs.copyFile(
        resolve(tempDit, '@paprize', 'puppeteer.md'),
        resolve('./docs/puppeteer/api.md')
    );
    await fs.rm(tempDit, { force: true, recursive: true });
}
