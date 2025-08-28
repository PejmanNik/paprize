import { describe, it, expect, vi } from 'vitest';
import {
    defaultConfig,
    getConfigFromAttributes,
    type PaginationConfig,
} from './PaginationConfig';
import * as attributesModule from './attributes';

describe('PaginationConfig', () => {
    describe('getConfigFromAttributes', () => {
        it('should return merged config with default plugins', () => {
            vi.spyOn(
                attributesModule,
                'getNodeConfigAttribute'
            ).mockReturnValue({
                hyphen: '+',
            });

            const globalConfig: PaginationConfig = {
                plugins: [
                    {
                        name: 'testPlugin',
                        onClone: vi.fn(),
                    },
                ],
                hyphen: '=',
                hyphenationEnabled: true,
                keepOnSamePage: true,
            };

            const result = getConfigFromAttributes({} as Node, globalConfig);

            expect(result.hyphen).toBe('+');
            expect(result.keepOnSamePage).toEqual(globalConfig.keepOnSamePage);
            expect(result.hyphenationEnabled).toEqual(
                globalConfig.hyphenationEnabled
            );
            expect(result.plugins).toEqual(globalConfig.plugins);
        });

        it('should handle null node and undefined globalConfig', () => {
            vi.spyOn(
                attributesModule,
                'getNodeConfigAttribute'
            ).mockReturnValue({});

            const result = getConfigFromAttributes(null, undefined);
            expect(result.hyphen).toBe(defaultConfig.hyphen);
            expect(result.keepOnSamePage).toBe(defaultConfig.keepOnSamePage);
            expect(result.hyphenationEnabled).toBe(
                defaultConfig.hyphenationEnabled
            );
            expect(result.plugins).toEqual([]);
        });
    });
});
