import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

export default function CalendarScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="px-6 py-4 border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-800">{t('calendar.history')}</Text>
      </View>
      <ScrollView className="flex-1 p-4">
        <View className="bg-gray-100 h-64 rounded-2xl items-center justify-center mb-6">
          <Text className="text-gray-400">{t('calendar.mock.title')}</Text>
          <Text className="text-gray-400 text-xs mt-2">{t('calendar.mock.description')}</Text>
        </View>

        <Text className="text-lg font-bold text-gray-800 mb-4 px-2">Jan 15, 2026</Text>

        {/* Daily Detail Mock */}
        <View className="bg-white border border-gray-100 rounded-xl p-4 mb-3 shadow-sm flex-row items-center">
          <View className="w-2 h-12 bg-green-400 rounded-full mr-4" />
          <View>
            <Text className="text-base font-bold text-gray-800">{t('calendar.mock.lunch')}</Text>
            <Text className="text-gray-500">{t('calendar.mock.meal')}</Text>
          </View>
          <Text className="ml-auto text-gray-400">12:30</Text>
        </View>

        <View className="bg-red-50 border border-red-100 rounded-xl p-4 mb-3 shadow-sm flex-row items-center">
          <View className="w-2 h-12 bg-red-400 rounded-full mr-4" />
          <View>
            <Text className="text-base font-bold text-red-800">{t('calendar.mock.symptom')}</Text>
            <Text className="text-red-600">{t('calendar.mock.symptomDetail')}</Text>
          </View>
          <Text className="ml-auto text-red-400">14:00</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

