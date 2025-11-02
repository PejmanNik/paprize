import { describe, it, expect, vi } from 'vitest';
import {
    defaultPaginationOptions,
    resolvePaginationOptions,
    type PaginationOptions,
} from './PaginationOptions';
import * as attributesModule from './attributes';

describe('PaginationConfig', () => {
    describe('resolvePaginationOptions', () => {
        it('should return merged config with default plugins', () => {
            vi.spyOn(
                attributesModule,
                'getNodeLayoutOptionsFromAttribute'
            ).mockReturnValue({
                hyphen: '+',
            });

            const globalConfig: PaginationOptions = {
                id: 'id',
                plugins: [
                    {
                        name: 'testPlugin',
                        order: 1,
                        onClone: vi.fn(),
                    },
                ],
                hyphen: '=',
                hyphenationDisabled: false,
                keepOnSamePage: true,
            };

            const result = resolvePaginationOptions({} as Node, globalConfig);

            expect(result.hyphen).toBe('+');
            expect(result.keepOnSamePage).toEqual(globalConfig.keepOnSamePage);
            expect(result.hyphenationDisabled).toEqual(
                globalConfig.hyphenationDisabled
            );
            expect(result.plugins).toEqual(globalConfig.plugins);
        });

        it('should handle null node and undefined globalConfig', () => {
            vi.spyOn(
                attributesModule,
                'getNodeLayoutOptionsFromAttribute'
            ).mockReturnValue({});

            const result = resolvePaginationOptions(null, undefined);
            expect(result.hyphen).toBe(defaultPaginationOptions.hyphen);
            expect(result.keepOnSamePage).toBe(
                defaultPaginationOptions.keepOnSamePage
            );
            expect(result.hyphenationDisabled).toBe(
                defaultPaginationOptions.hyphenationDisabled
            );
            expect(result.plugins).toEqual([]);
        });
    });
});
