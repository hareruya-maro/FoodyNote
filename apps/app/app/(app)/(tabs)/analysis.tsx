import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMeals } from '../../../hooks/useMeals';
import { useSymptoms } from '../../../hooks/useSymptoms';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// Configuration
const ANALYSIS_WINDOW_HOURS = 12;

type TriggerCandidate = {
    name: string;
    count: number;
    score: number;
};

export default function AnalysisScreen() {
    const { data: meals, isLoading: mealsLoading } = useMeals();
    const { data: symptoms, isLoading: symptomsLoading } = useSymptoms();
    const { t } = useTranslation();

    const candidates = useMemo(() => {
        if (!meals || !symptoms) return [];

        const tagCounts: Record<string, number> = {};
        let totalSymptomsAnalyzed = 0;

        symptoms.forEach(symptom => {
            totalSymptomsAnalyzed++;
            const symptomTime = new Date(symptom.timestamp).getTime();
            const windowStart = symptomTime - (ANALYSIS_WINDOW_HOURS * 60 * 60 * 1000);

            const relevantMeals = meals.filter(m => {
                const mealTime = new Date(m.timestamp).getTime();
                return mealTime >= windowStart && mealTime < symptomTime;
            });

            relevantMeals.forEach(meal => {
                meal.tags.forEach(tag => {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                });
            });
        });

        const results: TriggerCandidate[] = Object.entries(tagCounts).map(([name, count]) => {
            const rawScore = totalSymptomsAnalyzed > 0 ? (count / totalSymptomsAnalyzed) * 100 : 0;
            return {
                name,
                count,
                score: Math.round(rawScore)
            };
        });

        return results.sort((a, b) => b.score - a.score).slice(0, 5);
    }, [meals, symptoms]);

    const topCandidate = candidates.length > 0 ? candidates[0] : null;

    if (mealsLoading || symptomsLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50">
                <ActivityIndicator size="small" color="#009688" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
            <View className="px-6 py-4 bg-white border-b border-gray-100">
                <Text className="text-2xl font-bold text-gray-800">{t('analysis.title')}</Text>
            </View>

            <ScrollView className="flex-1 p-6">
                {topCandidate ? (
                    <View className="bg-teal-700 rounded-3xl p-6 mb-8 shadow-lg">
                        <Text className="text-teal-100 font-medium mb-1">{t('analysis.triggerFound')}</Text>
                        <Text className="text-white text-3xl font-bold mb-4">{topCandidate.name}</Text>
                        <Text className="text-teal-50 leading-5">
                            {t('analysis.insight', { name: topCandidate.name, count: topCandidate.count })}
                        </Text>
                    </View>
                ) : (
                    <View className="bg-gray-200 rounded-3xl p-6 mb-8 items-center justify-center">
                        <Text className="text-gray-500 font-medium text-center">{t('analysis.noData.title')}</Text>
                        <Text className="text-gray-400 text-sm mt-2 text-center">{t('analysis.noData.description')}</Text>
                    </View>
                )}

                <Text className="text-lg font-bold text-gray-800 mb-4">{t('analysis.topCandidates')}</Text>

                {candidates.map((item, i) => (
                    <View key={i} className="bg-white p-5 rounded-2xl mb-3 flex-row items-center border border-gray-100">
                        <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${i === 0 ? 'bg-red-100' : 'bg-gray-100'}`}>
                            <Text className={`font-bold ${i === 0 ? 'text-red-600' : 'text-gray-600'}`}>{i + 1}</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-lg font-bold text-gray-800">{item.name}</Text>
                            <Text className="text-gray-500 text-sm">{t('analysis.associatedEpisodes', { count: item.count })}</Text>
                        </View>
                        <View className="items-end">
                            <Text className="text-lg font-bold text-accent">{item.score}%</Text>
                            <Text className="text-xs text-gray-400">{t('analysis.freq')}</Text>
                        </View>
                    </View>
                ))}

                {candidates.length === 0 && (
                    <Text className="text-gray-400 text-center mt-10">{t('analysis.noPatterns')}</Text>
                )}

            </ScrollView>
        </SafeAreaView>
    );
}
