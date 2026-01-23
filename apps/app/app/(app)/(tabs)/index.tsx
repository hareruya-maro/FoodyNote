import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Activity, Frown, Meh, AlertCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { useMeals } from '../../../hooks/useMeals';
import { useSymptoms } from '../../../hooks/useSymptoms';
import { MealRecord, SymptomRecord } from '../../../types';
import { format } from 'date-fns';

type TimelineItem = {
  type: 'meal' | 'symptom';
  data: MealRecord | SymptomRecord;
  timestamp: string;
};

export default function HomeScreen() {
  const router = useRouter();
  const { data: meals, isLoading: mealsLoading } = useMeals();
  const { data: symptoms, isLoading: symptomsLoading } = useSymptoms();

  const timelineData = useMemo(() => {
    if (!meals || !symptoms) return [];

    // Sort logic handled in hook query usually, but re-sort for combined list
    const combined: TimelineItem[] = [
      ...meals.map(m => ({ type: 'meal' as const, data: m, timestamp: m.timestamp })),
      ...symptoms.map(s => ({ type: 'symptom' as const, data: s, timestamp: s.timestamp })),
    ];
    return combined.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [meals, symptoms]);

  const renderItem = ({ item }: { item: TimelineItem }) => {
    const isMeal = item.type === 'meal';
    const date = new Date(item.timestamp);
    const timeStr = format(date, 'HH:mm');

    return (
      <View className={`mb-4 p-4 rounded-2xl shadow-sm mx-4 ${!isMeal ? 'bg-red-50 border border-red-100' : 'bg-white'}`}>
        <View className="flex-row items-start">
          <View className="mr-4 pt-1 w-10">
            <Text className="text-gray-500 font-medium text-xs">{timeStr}</Text>
          </View>

          <View className="flex-1">
            {isMeal ? (
              // Meal Item
              <View>
                <Text className="text-lg font-bold text-gray-800">{(item.data as MealRecord).title}</Text>
                <View className="flex-row flex-wrap mt-1 mb-2">
                  {(item.data as MealRecord).tags.map((tag, idx) => (
                    <View key={idx} className="bg-gray-100 px-2 py-0.5 rounded-full mr-1 mb-1">
                      <Text className="text-xs text-gray-600">#{tag}</Text>
                    </View>
                  ))}
                </View>
                {(item.data as MealRecord).imageUri && (
                  <View className="h-40 bg-gray-200 rounded-xl w-full items-center justify-center overflow-hidden">
                    <Image source={{ uri: (item.data as MealRecord).imageUri }} className="w-full h-full" resizeMode="cover" />
                  </View>
                )}
              </View>
            ) : (
              // Symptom Item
              <View>
                <View className="flex-row items-center mb-1">
                  {(item.data as SymptomRecord).type === 'pain' && <Frown size={20} color="#ef4444" />}
                  {(item.data as SymptomRecord).type === 'bloated' && <Meh size={20} color="#ca8a04" />}
                  {(item.data as SymptomRecord).type === 'nausea' && <AlertCircle size={20} color="#3b82f6" />}

                  <Text className="text-lg font-bold text-gray-800 ml-2 capitalize">{(item.data as SymptomRecord).type}</Text>
                  <View className="ml-2 bg-white/50 px-2 py-0.5 rounded-full border border-gray-200">
                    <Text className="text-xs font-bold text-gray-600 capitalize">{(item.data as SymptomRecord).severity}</Text>
                  </View>
                </View>
                {(item.data as SymptomRecord).note ? (
                  <Text className="text-gray-600 mt-1">{(item.data as SymptomRecord).note}</Text>
                ) : null}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  if (mealsLoading || symptomsLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#009688" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <View className="px-6 py-4 bg-white border-b border-gray-100 mb-2 flex-row justify-between items-center">
        <Text className="text-2xl font-extrabold text-primary">Foody Note</Text>
      </View>

      <FlatList
        data={timelineData}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.type + item.timestamp + index}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Text className="text-gray-400">No records yet.</Text>
            <Text className="text-gray-400 text-xs mt-1">Add your first meal or symptom!</Text>
          </View>
        }
      />

      <View className="absolute bottom-6 right-6 items-end gap-y-3 z-50">
        <TouchableOpacity
          onPress={() => router.push('/symptom')}
          className="flex-row items-center bg-accent px-5 py-3 rounded-full shadow-lg active:scale-95 transition-transform"
        >
          <Activity color="white" size={20} />
          <Text className="text-white font-bold ml-2">Symptom</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/meal')}
          className="flex-row items-center bg-primary px-5 py-3 rounded-full shadow-lg active:scale-95 transition-transform"
        >
          <Camera color="white" size={20} />
          <Text className="text-white font-bold ml-2">Meal</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
