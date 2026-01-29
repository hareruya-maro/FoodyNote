import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Activity, Frown, Meh, AlertCircle } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { MealRecord, SymptomRecord } from '../types';

export type TimelineItemProps = {
    item: {
        type: 'meal' | 'symptom';
        data: MealRecord | SymptomRecord;
        timestamp: string;
    };
};

export function TimelineItem({ item }: TimelineItemProps) {
    const router = useRouter();
    const { t } = useTranslation();
    const isMeal = item.type === 'meal';
    const date = new Date(item.timestamp);
    const timeStr = format(date, 'HH:mm');

    return (
        <TouchableOpacity
            onPress={() => {
                if (isMeal) {
                    router.push({ pathname: '/meal', params: { id: item.data.id } });
                } else {
                    router.push({ pathname: '/symptom', params: { id: item.data.id } });
                }
            }}
            className={`mb-4 p-4 rounded-2xl shadow-sm mx-4 ${!isMeal ? 'bg-red-50 border border-red-100' : 'bg-white'}`}
        >
            <View className="flex-row items-start">
                <View className="mr-4 pt-1 w-10">
                    <Text className="text-gray-500 font-medium text-xs">{timeStr}</Text>
                </View>

                <View className="flex-1">
                    {isMeal ? (
                        <View>
                            <Text className="text-lg font-bold text-gray-800">{(item.data as MealRecord).title}</Text>
                            <View className="flex-row flex-wrap mt-1 mb-2">
                                {(item.data as MealRecord).tags.map((tag, idx) => (
                                    <View key={idx} className="bg-gray-100 px-2 py-0.5 rounded-full mr-1 mb-1">
                                        <Text className="text-xs text-gray-600">#{typeof tag === 'string' ? tag : tag.label}</Text>
                                    </View>
                                ))}
                                {(item.data as MealRecord).activeInquiry && (
                                    <View className="bg-yellow-100 px-2 py-0.5 rounded-full mr-1 mb-1 border border-yellow-200">
                                        <Text className="text-xs text-yellow-700">? Check top</Text>
                                    </View>
                                )}
                            </View>
                            {(item.data as MealRecord).imageUri && (
                                <View className="h-40 bg-gray-200 rounded-xl w-full items-center justify-center overflow-hidden">
                                    <Image source={{ uri: (item.data as MealRecord).imageUri }} className="w-full h-full" resizeMode="cover" />
                                </View>
                            )}
                        </View>
                    ) : (
                        <View>
                            <View className="flex-row items-center mb-1">
                                {(item.data as SymptomRecord).type === 'pain' && <Frown size={20} color="#ef4444" />}
                                {(item.data as SymptomRecord).type === 'bloated' && <Meh size={20} color="#ca8a04" />}
                                {(item.data as SymptomRecord).type === 'nausea' && <AlertCircle size={20} color="#3b82f6" />}

                                <Text className="text-lg font-bold text-gray-800 ml-2 capitalize">
                                    {t(`symptoms.types.${(item.data as SymptomRecord).type}`, { defaultValue: (item.data as SymptomRecord).type })}
                                </Text>
                                <View className="ml-2 bg-white/50 px-2 py-0.5 rounded-full border border-gray-200">
                                    <Text className="text-xs font-bold text-gray-600 capitalize">
                                        {t(`symptoms.severities.${(item.data as SymptomRecord).severity}`, { defaultValue: (item.data as SymptomRecord).severity })}
                                    </Text>
                                </View>
                            </View>
                            {(item.data as SymptomRecord).note ? (
                                <Text className="text-gray-600 mt-1">{(item.data as SymptomRecord).note}</Text>
                            ) : null}
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}
