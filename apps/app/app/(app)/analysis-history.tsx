import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AnalysisReport = {
    id: string;
    headline: string;
    evidence: string;
    proposal: string;
    createdAt: any; // Firestore Timestamp
};

export default function AnalysisHistoryScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const [reports, setReports] = useState<AnalysisReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const user = auth.currentUser;
            if (!user) return;

            const q = query(
                collection(db, 'users', user.uid, 'analysis_reports'),
                orderBy('createdAt', 'desc')
            );

            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as AnalysisReport[];

            setReports(data);
        } catch (error: any) {
            console.error(error);
            Alert.alert(t('common.error'), t('analysis.historyFetchFailed', 'Failed to fetch history'));
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const renderItem = ({ item }: { item: AnalysisReport }) => {
        const date = item.createdAt ? item.createdAt.toDate() : new Date();
        const isExpanded = expandedId === item.id;

        return (
            <TouchableOpacity
                onPress={() => toggleExpand(item.id)}
                activeOpacity={0.7}
                className="bg-white p-4 rounded-xl mb-3 shadow-sm border border-gray-100"
            >
                <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1 mr-2">
                        <View className="flex-row items-center mb-1">
                            <Calendar size={14} color="#9ca3af" className="mr-1" />
                            <Text className="text-gray-400 text-xs font-medium">
                                {format(date, 'yyyy/MM/dd HH:mm')}
                            </Text>
                        </View>
                        <Text className="text-lg font-bold text-gray-800 leading-6">
                            {item.headline}
                        </Text>
                    </View>
                    <View className="bg-gray-50 p-1.5 rounded-full">
                        {isExpanded ? (
                            <ChevronUp size={20} color="#6b7280" />
                        ) : (
                            <ChevronDown size={20} color="#6b7280" />
                        )}
                    </View>
                </View>

                {isExpanded && (
                    <View className="mt-2 pt-3 border-t border-gray-100">
                        <View className="mb-3">
                            <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                                {t('analysis.evidence')}
                            </Text>
                            <Text className="text-gray-700 leading-5">
                                {item.evidence}
                            </Text>
                        </View>

                        <View className="bg-teal-50 p-3 rounded-lg border-l-4 border-teal-500">
                            <Text className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
                                {t('analysis.proposal')}
                            </Text>
                            <Text className="text-gray-800 font-medium leading-5">
                                {item.proposal}
                            </Text>
                        </View>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
            <Stack.Screen options={{
                title: t('analysis.history'),
                headerBackTitle: t('common.back'),
                headerTintColor: '#009688',
            }} />

            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="small" color="#009688" />
                </View>
            ) : reports.length === 0 ? (
                <View className="flex-1 items-center justify-center p-8">
                    <Text className="text-gray-400 text-center text-lg mb-2">
                        {t('analysis.noHistory', 'No analysis history yet')}
                    </Text>
                    <Text className="text-gray-300 text-center text-sm">
                        {t('analysis.historyHint', 'Run an analysis to see reports here')}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={reports}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ padding: 16 }}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}
