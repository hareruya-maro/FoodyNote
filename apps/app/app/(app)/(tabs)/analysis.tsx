import { useRouter } from 'expo-router';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useAtom } from 'jotai';
import { ArrowRight, Brain, ChevronDown, ChevronUp, History, Lightbulb, PenTool, Search, Sparkles, User } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnalysisContextModal } from '../../../components/AnalysisContextModal';
import { AnalysisVisuals } from '../../../components/AnalysisVisuals';
import { app } from '../../../firebaseConfig'; // Adjust if path is different
import { useMeals } from '../../../hooks/useMeals';
import { useSymptoms } from '../../../hooks/useSymptoms';
import { getUserProfile } from '../../../services/userService';
import { userAtom } from '../../../store/userAtom';
import { AnalysisContext } from '../../../types';
import { calculateAutomaticContext } from '../../../utils/analysisUtils';

type AgenticReport = {
    headline: string;
    evidence: string;
    proposal: string;
    doctorComment?: string;
};

export default function AnalysisScreen() {
    const router = useRouter();
    const [session] = useAtom(userAtom);
    const { data: meals, isLoading: mealsLoading } = useMeals();
    const { data: symptoms, isLoading: symptomsLoading } = useSymptoms();
    const { t, i18n } = useTranslation();

    const [report, setReport] = useState<AgenticReport | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [activeAgent, setActiveAgent] = useState<"analyst" | "researcher" | "writer" | "">("");
    const [modalVisible, setModalVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

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
            const analyzeWeeklyReport = httpsCallable(functions, 'analyzeWeeklyReport', { timeout: 540000 });

            const minWait = new Promise(resolve => setTimeout(resolve, 2000));

            const callPromise = analyzeWeeklyReport({
                userProfile,
                context,
                period,
                language: i18n.language === 'ja' ? 'Japanese' : 'English'
            });

            setTimeout(() => setActiveAgent("researcher"), 5000);
            setTimeout(() => setActiveAgent("writer"), 10000);

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
                            <View className="flex-row items-center mb-2">
                                <View className="bg-green-100 p-1.5 rounded-full mr-2">
                                    <User size={14} color="#059669" />
                                </View>
                                <Text className="text-xs font-bold text-green-800">{t('doctor.aiMedicalInsight', 'AI Insight')}</Text>
                            </View>

                            <Text className="text-xl font-serif text-gray-900 mb-4 leading-8 font-bold">
                                {report.headline || t('doctor.defaultHeadline', 'Analysis Complete')}
                            </Text>

                            <View className="bg-teal-50 p-4 rounded-xl border border-teal-100 mb-4">
                                <View className="flex-row items-center mb-2">
                                    <Lightbulb size={16} color="#0d9488" />
                                    <Text className="text-sm font-bold text-teal-900 ml-2">{t('analysis.proposal')}</Text>
                                </View>
                                <Text className="text-gray-800 font-medium leading-relaxed">{report.proposal}</Text>
                            </View>

                            <TouchableOpacity
                                onPress={() => setShowDetails(!showDetails)}
                                className="bg-gray-50 px-3 py-2 rounded border border-gray-200 w-full shadow-sm flex-row justify-center items-center mb-4"
                            >
                                <Text className="text-gray-600 text-xs font-bold mr-1">
                                    {showDetails ? t('doctor.hideDetails', 'Hide Detailed Insights') : t('doctor.showDetails', 'Show Detailed Insights')}
                                </Text>
                                {showDetails ? <ChevronUp size={14} color="#4b5563" /> : <ChevronDown size={14} color="#4b5563" />}
                            </TouchableOpacity>

                            {showDetails && (
                                <View className="pt-2 border-t border-gray-100">

                                    <View>
                                        <Text className="text-xs font-bold text-gray-400 mb-1 uppercase">{t('analysis.evidence')}</Text>
                                        <Text className="text-sm text-gray-600 leading-relaxed">{report.evidence}</Text>
                                    </View>
                                </View>
                            )}

                            <TouchableOpacity
                                onPress={handleStartAnalysis}
                                className="mt-2 self-end flex-row items-center"
                            >
                                <Text className="text-gray-400 text-sm mr-1">{t('analysis.refresh')}</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View className="bg-gradient-to-r from-teal-500 to-teal-600 bg-teal-500 rounded-3xl p-6 shadow-lg">
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

                {/* Analysis Visuals Section (Ranking & Map) */}
                <AnalysisVisuals meals={meals} symptoms={symptoms} />

                <View className="h-10" />

            </ScrollView>
        </SafeAreaView>
    );
}
