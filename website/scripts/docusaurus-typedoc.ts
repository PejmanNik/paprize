import { buildTypeDoc } from './build-type-doc';
import type { Plugin } from '@docusaurus/types';

export default function TypedocPlugin(): Plugin {
    return {
        name: 'typedoc-docusaurus-plugin',
        loadContent() {
            return buildTypeDoc(__dirname);
        },
    };
}
