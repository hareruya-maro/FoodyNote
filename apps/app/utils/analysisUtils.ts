import { MealRecord } from '../types';

export const calculateAutomaticContext = (meals: MealRecord[], startDate: Date, endDate: Date) => {
    let late_night_meals_count = 0;

    // Group meals by date
    const mealsByDate: Record<string, MealRecord[]> = {};

    meals.forEach(meal => {
        const d = new Date(meal.timestamp);
        if (d < startDate || d > endDate) return;

        const dateKey = d.toISOString().split('T')[0];
        if (!mealsByDate[dateKey]) mealsByDate[dateKey] = [];
        mealsByDate[dateKey].push(meal);

        // Check late night (after 21:00)
        const hour = d.getHours();
        if (hour >= 21 || hour < 4) { // 21:00 - 04:00
            late_night_meals_count++;
        }
    });

    // Irregular eating: check for missing meals
    // We expect Breakfast (5-10), Lunch (11-15), Dinner (17-22)
    let missed_meals_count = 0;

    Object.values(mealsByDate).forEach(dayMeals => {
        let hasBreakfast = false;
        let hasLunch = false;
        let hasDinner = false;

        dayMeals.forEach(meal => {
            const h = new Date(meal.timestamp).getHours();
            if (h >= 5 && h <= 10) hasBreakfast = true;
            if (h >= 11 && h <= 15) hasLunch = true;
            if (h >= 17 && h <= 22) hasDinner = true;
        });

        if (!hasBreakfast) missed_meals_count++;
        if (!hasLunch) missed_meals_count++;
        if (!hasDinner) missed_meals_count++;
    });

    const is_irregular_eating = missed_meals_count >= 3;

    return {
        is_irregular_eating,
        late_night_meals_count
    };
};
