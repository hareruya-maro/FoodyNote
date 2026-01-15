import { atom } from 'jotai';
import { MealRecord } from '@/types';

// In-memory store for Phase 2
export const mealsAtom = atom<MealRecord[]>([]);

// Derived atom to get meals sorted by date (newest first)
export const sortedMealsAtom = atom((get) => {
    const meals = get(mealsAtom);
    return [...meals].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
});

export const addMealAtom = atom(
    null,
    (get, set, newMeal: Omit<MealRecord, 'id' | 'timestamp'>) => {
        const meal: MealRecord = {
            ...newMeal,
            id: Math.random().toString(36).substring(7),
            timestamp: new Date().toISOString(),
        };
        set(mealsAtom, (prev) => [meal, ...prev]);
    }
);
