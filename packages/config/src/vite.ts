import type { ConfigEnv, UserConfig } from 'vite';
import checker from 'vite-plugin-checker';
import dts from 'unplugin-dts/vite';
import fs from 'fs/promises';

export function paprizeConfig(
    config: UserConfig
): (env: ConfigEnv) => Promise<UserConfig> {
    return async (env: ConfigEnv) => {
        return deepMerge(config, await createGlobalConfig(env));
    };
}

async function createGlobalConfig({ mode }: ConfigEnv): Promise<UserConfig> {
    const tsconfigPath = await fs
        .access('./tsconfig.app.json')
        .then(() => 'tsconfig.app.json')
        .catch(() => 'tsconfig.json');

    return {
        build: {
            rollupOptions: {
                external: ['@paprize/core'],
                output: {
                    globals: {
                        '@paprize/core': 'PaprizeCore',
                    },
                },
            },
        },
        esbuild: {
            dropLabels: mode === 'production' ? ['DEV'] : [],
        },
        plugins: [
            dts({
                bundleTypes: true,
                tsconfigPath,
                aliases: [],
            }),
            checker({
                typescript: true,
            }),
        ],
    };
}

function deepMerge<T extends object>(...objects: T[]): T {
    const isObject = (obj: unknown): obj is object =>
        !!obj && typeof obj === 'object';

    return objects.reduce((prev, obj) => {
        Object.keys(obj).forEach((key) => {
            const typedKey = key as keyof T;
            const pVal = prev[typedKey];
            const oVal = obj[typedKey];

            if (Array.isArray(pVal) && Array.isArray(oVal)) {
                prev[typedKey] = pVal.concat(...oVal) as T[typeof typedKey];
            } else if (isObject(pVal) && isObject(oVal)) {
                prev[typedKey] = deepMerge(pVal, oVal);
            } else {
                prev[typedKey] = oVal;
            }
        });

        return prev;
    }, {} as T);
}
