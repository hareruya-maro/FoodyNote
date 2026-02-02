import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMeals } from '../../../hooks/useMeals';
import { useSymptoms } from '../../../hooks/useSymptoms';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../../../firebaseConfig'; // Adjust if path is different
import { Sparkles, ArrowRight, Brain, Search, PenTool, History } from 'lucide-react-native';
import { AnalysisContextModal } from '../../../components/AnalysisContextModal';
import { calculateAutomaticContext } from '../../../utils/analysisUtils';
import { getUserProfile } from '../../../services/userService';
import { useAtom } from 'jotai';
import { userAtom } from '../../../store/userAtom';
import { AnalysisContext } from '../../../types';
import { useRouter } from 'expo-router';

// Configuration
const ANALYSIS_WINDOW_HOURS = 12;

type TriggerCandidate = {
    name: string;
    count: number;
    score: number;
};

type AgenticReport = {
    headline: string;
    evidence: string;
    proposal: string;
};

export default function AnalysisScreen() {
    const router = useRouter();
    const [session] = useAtom(userAtom);
    const { data: meals, isLoading: mealsLoading } = useMeals();
    const { data: symptoms, isLoading: symptomsLoading } = useSymptoms();
    const { t } = useTranslation();

    const [report, setReport] = useState<AgenticReport | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [activeAgent, setActiveAgent] = useState<"analyst" | "researcher" | "writer" | "">("");
    const [modalVisible, setModalVisible] = useState(false);

    const handleStartAnalysis = () => {
        setModalVisible(true);
    };

    const runAnalysisWithContext = async (subjectiveFactors: string[]) => {
        setModalVisible(false);
        setAnalyzing(true);
        setActiveAgent("analyst");

        try {
            // Get user profile
            const userProfile = session?.uid ? await getUserProfile(session.uid) : null;

            // Calculate auto context
            // Default period is 3 months back to now
            const endDate = new Date();
            const startDate = new Date();
            startDate.setMonth(endDate.getMonth() - 3);

            const autoContext = calculateAutomaticContext(meals || [], startDate, endDate);

            const context: AnalysisContext = {
                subjective_factors: subjectiveFactors,
                ...autoContext
            };

            // Prepare period
            const period = {
                start: startDate.toISOString(),
                end: endDate.toISOString()
            };

            const functions = getFunctions(app);
            const analyzeWeeklyReport = httpsCallable(functions, 'analyzeWeeklyReport');

            const minWait = new Promise(resolve => setTimeout(resolve, 2000));

            const callPromise = analyzeWeeklyReport({
                userProfile,
                context,
                period
            });

            setTimeout(() => setActiveAgent("researcher"), 2500);
            setTimeout(() => setActiveAgent("writer"), 5000);

            const [response] = await Promise.all([callPromise, minWait]);

            const data = response.data as AgenticReport;
            setReport(data);

        } catch (error: any) {
            console.error(error);
            Alert.alert(t('analysis.analysisFailed'), error.message);
        } finally {
            setAnalyzing(false);
            setActiveAgent("");
        }
    };

    const candidates = useMemo(() => {
        if (!meals || !symptoms) return [];

        const tagCounts: Record<string, { count: number, label: string }> = {};
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
                    // Safe handling for potentially mixed runtime types (string vs Tag object)
                    // We cast to any to perform runtime check because TS expects Tag
                    const tagAny = tag as any;
                    const id = (typeof tagAny === 'string' ? tagAny : tagAny.id) as string;
                    const label = (typeof tagAny === 'string' ? tagAny : tagAny.label) as string;

                    if (!tagCounts[id]) {
                        tagCounts[id] = { count: 0, label: label };
                    }
                    tagCounts[id].count += 1;
                    // Update label to latest seen (prefer object label over string)
                    if (tag.label) tagCounts[id].label = tag.label;
                });
            });
        });

        const results: TriggerCandidate[] = Object.entries(tagCounts).map(([id, data]) => {
            const rawScore = totalSymptomsAnalyzed > 0 ? (data.count / totalSymptomsAnalyzed) * 100 : 0;
            return {
                name: data.label, // Use friendly label for display
                count: data.count,
                score: Math.round(rawScore)
            };
        });

        return results.sort((a, b) => b.score - a.score).slice(0, 5);
    }, [meals, symptoms]);

    if (mealsLoading || symptomsLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50">
                <ActivityIndicator size="small" color="#009688" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
            <View className="px-6 py-4 bg-white border-b border-gray-100 flex-row justify-between items-center">
                <Text className="text-2xl font-bold text-gray-800">{t('tabs.analysis')}</Text>
                <TouchableOpacity
                    onPress={() => router.push('/(app)/analysis-history')}
                    className="p-2 bg-gray-50 rounded-full"
                >
                    <History size={20} color="#4b5563" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-6">

                {/* Agentic Analysis Section */}
                <View className="mb-8">
                    <View className="flex-row items-center mb-4">
                        <Sparkles color="#009688" size={20} className="mr-2" />
                        <Text className="text-lg font-bold text-gray-800">{t('analysis.detectiveTitle')}</Text>
                    </View>

                    {analyzing ? (
                        <View className="bg-teal-50 rounded-3xl p-8 items-center justify-center border border-teal-100">
                            <ActivityIndicator size="large" color="#009688" className="mb-4" />
                            <Text className="text-teal-800 font-medium text-center mb-2">
                                {activeAgent === "analyst" ? t('analysis.agentStatus.analyst') :
                                    activeAgent === "researcher" ? t('analysis.agentStatus.researcher') :
                                        activeAgent === "writer" ? t('analysis.agentStatus.writer') : ""}
                            </Text>
                            <View className="flex-row gap-4 mt-2">
                                <Brain size={20} color={activeAgent === "analyst" ? "#009688" : "#ccc"} />
                                <Search size={20} color={activeAgent === "researcher" ? "#009688" : "#ccc"} />
                                <PenTool size={20} color={activeAgent === "writer" ? "#009688" : "#ccc"} />
                            </View>
                        </View>
                    ) : report ? (
                        <View className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
                            <Text className="text-2xl font-serif text-gray-900 mb-4 leading-8">{report.headline}</Text>

                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{t('analysis.evidence')}</Text>
                                <Text className="text-gray-700 leading-6">{report.evidence}</Text>
                            </View>

                            <View className="bg-teal-50 p-4 rounded-xl border-l-4 border-teal-500">
                                <Text className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-1">{t('analysis.proposal')}</Text>
                                <Text className="text-gray-800 font-medium">{report.proposal}</Text>
                            </View>

                            <TouchableOpacity
                                onPress={handleStartAnalysis}
                                className="mt-4 self-end flex-row items-center"
                            >
                                <Text className="text-gray-400 text-sm mr-1">{t('analysis.refresh')}</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-3xl p-6 shadow-lg">
                            <Text className="text-white text-xl font-bold mb-2">{t('analysis.discoverPatterns')}</Text>
                            <Text className="text-teal-100 mb-4 leading-5">
                                {t('analysis.discoverDescription')}
                            </Text>
                            <TouchableOpacity
                                onPress={handleStartAnalysis}
                                className="bg-white py-3 px-6 rounded-full self-start flex-row items-center"
                            >
                                <Text className="text-teal-700 font-bold mr-2">{t('analysis.startInvestigation')}</Text>
                                <ArrowRight color="#00796b" size={16} />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <AnalysisContextModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onAnalyze={runAnalysisWithContext}
                />

                {/* Quick Stats Section */}
                <Text className="text-lg font-bold text-gray-800 mb-4">{t('analysis.topCandidates')}</Text>

                {candidates.map((item, i) => (
                    <View key={i} className="bg-white p-5 rounded-2xl mb-3 flex-row items-center border border-gray-100 shadow-sm">
                        <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${i === 0 ? 'bg-red-100' : 'bg-gray-100'}`}>
                            <Text className={`font-bold ${i === 0 ? 'text-red-600' : 'text-gray-600'}`}>{i + 1}</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-lg font-bold text-gray-800">{item.name}</Text>
                            <Text className="text-gray-500 text-sm">{t('analysis.associatedEpisodes', { count: item.count })}</Text>
                        </View>
                        <View className="items-end">
                            <Text className="text-lg font-bold text-accent">{item.score}%</Text>
                        </View>
                    </View>
                ))}

                {candidates.length === 0 && (
                    <View className="bg-gray-50 rounded-2xl p-8 items-center">
                        <Text className="text-gray-400 text-center">{t('analysis.noPatterns')}</Text>
                    </View>
                )}

                <View className="h-10" />

            </ScrollView>
        </SafeAreaView>
    );
}
