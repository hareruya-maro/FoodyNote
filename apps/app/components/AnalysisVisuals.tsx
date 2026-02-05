import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Check, Filter, Info } from 'lucide-react-native';
import { MealRecord, SymptomRecord, Tag } from '../types';
import { useTranslation } from 'react-i18next';

type Props = {
    meals: MealRecord[] | undefined;
    symptoms: SymptomRecord[] | undefined;
};

type AnalysisItem = {
    id: string;
    label: string;
    count: number; // Consumption count
    risk: number; // Risk percentage
};

const SYMPTOMS_FILTER_OPTIONS = [
    { id: 'all', label: 'All', icon: '🔍' },
    { id: 'pain', label: 'Pain', icon: '⚡' },
    { id: 'bloated', label: 'Bloated', icon: '🎈' },
    { id: 'diarrhea', label: 'Diarrhea', icon: '💧' },
    { id: 'nausea', label: 'Nausea', icon: '🤢' },
    { id: 'tired', label: 'Tired', icon: 'Bz' },
];

export function AnalysisVisuals({ meals, symptoms }: Props) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'ranking' | 'map'>('ranking');
    const [selectedSymptomTypes, setSelectedSymptomTypes] = useState<string[]>(['all']);

    const analysisData = useMemo(() => {
        if (!meals || !symptoms) return [];

        // 1. Filter Symptoms
        const isAllSelected = selectedSymptomTypes.includes('all');
        const filteredSymptoms = isAllSelected
            ? symptoms
            : symptoms.filter(s => selectedSymptomTypes.includes(s.type));

        if (filteredSymptoms.length === 0) return [];

        // 2. Map Symptoms to Preceding Meals (24h window)
        const tagStats: Record<string, { label: string; totalAttempts: number; triggerCount: number }> = {};
        const totalSymptoms = filteredSymptoms.length;

        // A. Count total attempts per tag (How many times each food was eaten)
        meals.forEach(meal => {
            meal.tags.forEach(tag => {
                if (!tagStats[tag.id]) {
                    tagStats[tag.id] = { label: tag.label, totalAttempts: 0, triggerCount: 0 };
                }
                tagStats[tag.id].totalAttempts += 1;
            });
        });

        // B. Count prevalence in symptoms (How many symptoms were preceded by each food)
        filteredSymptoms.forEach(symptom => {
            const symptomTime = new Date(symptom.timestamp).getTime();
            const lookbackWindow = 24 * 60 * 60 * 1000;

            const relevantMeals = meals.filter(m => {
                const mealTime = new Date(m.timestamp).getTime();
                return mealTime < symptomTime && mealTime > (symptomTime - lookbackWindow);
            });

            // Collect unique tags in this window to avoid double counting for same symptom
            const uniqueTagsInWindow = new Set<string>();
            relevantMeals.forEach(m => {
                m.tags.forEach(t => uniqueTagsInWindow.add(t.id));
            });

            uniqueTagsInWindow.forEach(tagId => {
                if (tagStats[tagId]) {
                    tagStats[tagId].triggerCount += 1;
                }
            });
        });

        // 3. Format & Calculate Correlation %
        // Definition: Out of all upset events (filtered), what % were preceded by this tag?
        const results: AnalysisItem[] = Object.entries(tagStats)
            .map(([id, stats]) => ({
                id,
                label: stats.label,
                count: stats.totalAttempts,
                // Formula: (Count of symptoms preceded by this tag / Total count of symptoms) * 100
                risk: totalSymptoms > 0 ? Math.round((stats.triggerCount / totalSymptoms) * 100) : 0
            }))
            // Filter noise: must have been eaten at least 2 times total, and at least 1 trigger
            .filter(item => item.count >= 2 && item.risk > 0)
            .sort((a, b) => b.risk - a.risk);

        return results.slice(0, 10); // Top 10
    }, [meals, symptoms, selectedSymptomTypes]);

    const handleToggleFilter = (typeId: string) => {
        if (typeId === 'all') {
            setSelectedSymptomTypes(['all']);
        } else {
            setSelectedSymptomTypes(prev => {
                // If "all" was selected, clear it and select the new one
                let newSelection = prev.includes('all') ? [] : [...prev];

                if (newSelection.includes(typeId)) {
                    newSelection = newSelection.filter(id => id !== typeId);
                } else {
                    newSelection.push(typeId);
                }

                // If nothing selected, revert to 'all'
                if (newSelection.length === 0) return ['all'];
                return newSelection;
            });
        }
    };

    const renderRanking = () => (
        <View className="gap-4">
            <Text className="text-sm font-bold text-gray-700">
                {selectedSymptomTypes.includes('all')
                    ? t('analysis.allRiskFactors', 'Overall Risk Factors')
                    : t('analysis.filteredRiskFactors', {
                        type: selectedSymptomTypes.map(id => t(`symptoms.types.${id}`, id)).join(', '),
                        defaultValue: `${selectedSymptomTypes.join(', ')} Risk Factors`
                    })
                }
            </Text>
            {analysisData.length === 0 ? (
                <Text className="text-gray-400 text-center py-4">{t('analysis.noData', 'No correlation data found based on current history.')}</Text>
            ) : (
                analysisData.map((item, idx) => (
                    <View key={item.id}>
                        <View className="flex-row justify-between text-xs mb-1">
                            <Text className="font-bold text-gray-700">
                                {idx + 1}. {item.label} <Text className="text-gray-400 font-normal">({item.count} meals)</Text>
                            </Text>
                            <Text className={`font-bold ${item.risk >= 80 ? 'text-red-500' : item.risk >= 40 ? 'text-orange-400' : 'text-teal-500'}`}>
                                {item.risk}%
                            </Text>
                        </View>
                        <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <View
                                className={`h-full rounded-full ${item.risk >= 80 ? 'bg-red-500' : item.risk >= 40 ? 'bg-orange-400' : 'bg-teal-500'}`}
                                style={{ width: `${item.risk}%` }}
                            />
                        </View>
                    </View>
                ))
            )}
        </View>
    );

    const renderMap = () => {
        const containerHeight = 250;
        return (
            <View className="h-64 border-l border-b border-gray-300 m-2 relative">
                {/* Axis Labels */}
                <Text className="absolute -left-8 top-1/2 -rotate-90 text-[10px] text-gray-400 w-20 text-center">
                    {t('analysis.axisRisk', 'Risk %')}
                </Text>
                <Text className="absolute -bottom-6 left-1/2 text-[10px] text-gray-400 transform -translate-x-1/2">
                    {t('analysis.axisFreq', 'Frequency')}
                </Text>

                {/* Quadrant Label */}
                <Text className="absolute top-2 right-2 text-[10px] text-red-200 font-bold">
                    {t('analysis.highRiskZone', 'High Priority')}
                </Text>

                {analysisData.map(item => {
                    // Logic for position
                    // Y = Risk (0-100)
                    // X = Frequency (Clamp at some max, e.g. 50 meals? or relative to max count in dataset)
                    const maxCount = Math.max(...analysisData.map(d => d.count), 1);
                    const xPercent = Math.min((item.count / maxCount) * 100, 95);

                    return (
                        <View
                            key={item.id}
                            className={`absolute w-10 h-10 rounded-full items-center justify-center shadow-sm
                                ${item.risk >= 80 ? 'bg-red-500 z-10' : item.risk >= 40 ? 'bg-orange-400 opacity-90' : 'bg-teal-500 opacity-80'}
                            `}
                            style={{
                                bottom: `${item.risk}%`,
                                left: `${xPercent}%`,
                                transform: [{ translateX: -20 }, { translateY: 20 }] // Centering adjustment (roughly)
                            }}
                        >
                            <Text className="text-[9px] font-bold text-white text-center" numberOfLines={1}>
                                {item.label}
                            </Text>
                        </View>
                    );
                })}
            </View>
        );
    };

    return (
        <View className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
            {/* Visual Tabs */}
            <View className="flex-row bg-gray-200 rounded-lg p-1 mb-4">
                <TouchableOpacity
                    onPress={() => setActiveTab('ranking')}
                    className={`flex-1 py-1.5 rounded items-center ${activeTab === 'ranking' ? 'bg-white shadow' : ''}`}
                >
                    <Text className={`text-xs font-bold ${activeTab === 'ranking' ? 'text-teal-600' : 'text-gray-500'}`}>
                        {t('analysis.tabRanking', 'Trigger Ranking')}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveTab('map')}
                    className={`flex-1 py-1.5 rounded items-center ${activeTab === 'map' ? 'bg-white shadow' : ''}`}
                >
                    <Text className={`text-xs font-bold ${activeTab === 'map' ? 'text-teal-600' : 'text-gray-500'}`}>
                        {t('analysis.tabMap', 'Risk Map')}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Symptom Filter */}
            <View className="mb-6">
                <View className="flex-row items-center mb-2">
                    <Filter size={14} className="text-gray-400 mr-1" color="#9CA3AF" />
                    <Text className="text-xs font-bold text-gray-500">{t('analysis.filterBySymptom', 'Filter by Symptom:')}</Text>
                </View>
                <View className="flex-row flex-wrap gap-2">
                    {SYMPTOMS_FILTER_OPTIONS.map(opt => {
                        const isSelected = selectedSymptomTypes.includes(opt.id);
                        // For 'all', we don't translate 'types.all', just careful handling
                        const label = opt.id === 'all' ? t('common.all', 'All') : t(`symptoms.types.${opt.id}`, opt.label);

                        return (
                            <TouchableOpacity
                                key={opt.id}
                                onPress={() => handleToggleFilter(opt.id)}
                                className={`flex-row items-center px-3 py-1.5 rounded-full border mb-1
                                    ${isSelected
                                        ? 'bg-orange-500 border-orange-500'
                                        : 'bg-white border-gray-200'
                                    }`}
                            >
                                <Text className="mr-1 text-xs">{opt.icon}</Text>
                                <Text className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                                    {label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {/* Content Body */}
            {activeTab === 'ranking' ? renderRanking() : renderMap()}

        </View>
    );
}
