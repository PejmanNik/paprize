import { atom } from 'jotai';

export interface SectionInfo {
    totalPages: number;
    pendingSuspensions: Set<string>;
}

export const reportInfoAtom = atom<Map<string, SectionInfo>>(new Map());
reportInfoAtom.debugLabel = 'reportInfoAtom';
