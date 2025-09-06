import { atom, createStore } from 'jotai';

export const store = createStore();

export interface SectionState {
    totalPages: number;
    isPaginated: boolean;
    pendingSuspensions: ReadonlySet<string>;
}

export interface ReportState {
    totalSections: number;
    isPaginated: boolean;
}

export const defaultSectionState: SectionState = {
    totalPages: 0,
    isPaginated: false,
    pendingSuspensions: new Set(),
};

export const sectionsAtom = atom<ReadonlyMap<string, SectionState>>(new Map());
sectionsAtom.debugLabel = 'sectionsAtom';

export const reportAtom = atom<ReportState>({
    totalSections: 0,
    isPaginated: false,
});
reportAtom.debugLabel = 'reportAtom';
