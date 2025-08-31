import { atom } from 'jotai';

export interface SectionInfo {
    totalPages: number;
}

export const reportInfo = atom<Map<string, SectionInfo>>(new Map());
