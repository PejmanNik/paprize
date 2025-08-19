import { describe, it, expect, vi } from 'vitest';
import {
    defaultConfig,
    getConfigFromAttributes,
    triggerPlugins,
    type PaginationConfig,
    type PaginationPlugin,
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

    describe('triggerPlugins', () => {
        it('should call action for each plugin', () => {
            const plugins: PaginationPlugin[] = [
                {
                    name: 'one',
                    onClone: vi.fn(),
                },
                {
                    name: 'two',
                    onClone: vi.fn(),
                },
            ];

            const action = vi.fn();

            triggerPlugins(plugins, action);

            expect(action).toHaveBeenCalledTimes(2);
            expect(action).toHaveBeenNthCalledWith(1, plugins[0]);
            expect(action).toHaveBeenNthCalledWith(2, plugins[1]);
        });

        it('should not throw on empty plugins array', () => {
            expect(() => triggerPlugins([], vi.fn())).not.toThrow();
        });
    });
});
