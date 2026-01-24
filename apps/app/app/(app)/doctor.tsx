import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { useSymptoms } from '../../hooks/useSymptoms';
import { useMemo } from 'react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

export default function DoctorScreen() {
    const router = useRouter();
    const { data: symptoms, isLoading } = useSymptoms();
    const { t } = useTranslation();

    const stats = useMemo(() => {
        if (!symptoms) return { totalSymptoms: 0, avgLagTime: '--' };
        return {
            totalSymptoms: symptoms.length,
            avgLagTime: '2.5h', // Placeholder 
        };
    }, [symptoms]);

    const recentEpisodes = useMemo(() => symptoms ? symptoms.slice(0, 5) : [], [symptoms]);

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="small" color="#009688" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white">
            <SafeAreaView className="flex-1">
                <View className="px-6 py-4 border-b border-gray-200 flex-row justify-between items-center bg-gray-50">
                    <View>
                        <Text className="text-sm font-bold text-gray-500 uppercase">{t('doctor.reportTitle')}</Text>
                        <Text className="text-2xl font-bold text-gray-800">{t('doctor.reviewSummary')}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            if (router.canGoBack()) {
                                router.back();
                            } else {
                                router.replace('/');
                            }
                        }}
                        className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center"
                    >
                        <X color="#374151" size={24} />
                    </TouchableOpacity>
                </View>

                <ScrollView className="flex-1 p-6">
                    <View className="flex-row gap-4 mb-6">
                        <View className="flex-1 bg-red-50 p-4 rounded-xl border border-red-100">
                            <Text className="text-red-500 font-medium">{t('doctor.stats.symptoms')}</Text>
                            <Text className="text-3xl font-bold text-red-800 mt-2">{stats.totalSymptoms}</Text>
                            <Text className="text-xs text-red-400">{t('doctor.stats.totalRecorded')}</Text>
                        </View>
                        <View className="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <Text className="text-gray-500 font-medium">{t('doctor.stats.avgLag')}</Text>
                            <Text className="text-3xl font-bold text-gray-800 mt-2">{stats.avgLagTime}</Text>
                            <Text className="text-xs text-gray-400">{t('doctor.stats.eatingToSymptom')}</Text>
                        </View>
                    </View>

                    <Text className="text-lg font-bold text-gray-800 mb-4">{t('doctor.correlatedIngredients')}</Text>
                    <View className="bg-blue-50 p-4 rounded-xl mb-8">
                        <Text className="text-blue-800">{t('doctor.referAnalysis')}</Text>
                    </View>

                    <Text className="text-lg font-bold text-gray-800 mb-4">{t('doctor.recentEpisodes')}</Text>
                    <View className="gap-2">
                        {recentEpisodes.length === 0 ? (
                            <Text className="text-gray-400">{t('doctor.noEpisodes')}</Text>
                        ) : (
                            recentEpisodes.map((s, i) => (
                                <View key={i} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <Text className="font-bold text-gray-700">
                                        {format(new Date(s.timestamp), 'MMM dd, HH:mm')}
                                    </Text>
                                    <Text className="text-gray-600 mt-1">
                                        {t('doctor.condition', { type: s.type, severity: s.severity })}
                                    </Text>
                                    {s.note ? <Text className="text-gray-500 text-xs mt-1">"{s.note}"</Text> : null}
                                </View>
                            ))
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
