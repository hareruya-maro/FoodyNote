import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CalendarScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="px-6 py-4 border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-800">History</Text>
      </View>
      <ScrollView className="flex-1 p-4">
        <View className="bg-gray-100 h-64 rounded-2xl items-center justify-center mb-6">
          <Text className="text-gray-400">Calendar View Mock</Text>
          <Text className="text-gray-400 text-xs mt-2">Days with symptoms highlighted in Red</Text>
        </View>

        <Text className="text-lg font-bold text-gray-800 mb-4 px-2">Jan 15, 2026</Text>

        {/* Daily Detail Mock */}
        <View className="bg-white border border-gray-100 rounded-xl p-4 mb-3 shadow-sm flex-row items-center">
          <View className="w-2 h-12 bg-green-400 rounded-full mr-4" />
          <View>
            <Text className="text-base font-bold text-gray-800">Lunch</Text>
            <Text className="text-gray-500">Pasta (Carbonara)</Text>
          </View>
          <Text className="ml-auto text-gray-400">12:30</Text>
        </View>

        <View className="bg-red-50 border border-red-100 rounded-xl p-4 mb-3 shadow-sm flex-row items-center">
          <View className="w-2 h-12 bg-red-400 rounded-full mr-4" />
          <View>
            <Text className="text-base font-bold text-red-800">Symptom</Text>
            <Text className="text-red-600">Stomach Pain (Medium)</Text>
          </View>
          <Text className="ml-auto text-red-400">14:00</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
