import { signal } from '@preact/signals-core';

export const DebugModeType = {
    disabled: 0,
    verbose: 1,
    highlight: 2,
} as const;

const debugMode = signal<number>(DebugModeType.disabled);

export const setDebugMode = (mode: number) => {
    debugMode.value = mode;
};

export const isInHighlightMode = () =>
    debugMode.value === DebugModeType.highlight;
