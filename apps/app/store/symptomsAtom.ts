import { atom } from 'jotai';
import { SymptomRecord } from '@/types';

export const symptomsAtom = atom<SymptomRecord[]>([]);

// Derived atom to get symptoms sorted by date
export const sortedSymptomsAtom = atom((get) => {
    const symptoms = get(symptomsAtom);
    return [...symptoms].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
});

export const addSymptomAtom = atom(
    null,
    (get, set, newSymptom: Omit<SymptomRecord, 'id' | 'timestamp'>) => {
        const symptom: SymptomRecord = {
            ...newSymptom,
            id: Math.random().toString(36).substring(7),
            timestamp: new Date().toISOString(),
        };
        set(symptomsAtom, (prev) => [symptom, ...prev]);
    }
);
