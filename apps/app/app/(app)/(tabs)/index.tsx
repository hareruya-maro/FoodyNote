import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Activity } from 'lucide-react-native'; // Activity as Symptom icon
import { useRouter } from 'expo-router';

// Mock Data
const MOCK_DATA = [
  { id: '1', type: 'meal', time: '12:00', title: 'Lunch: Carbonara', tags: ['Pasta', 'Dairy', 'Egg'], image: 'placeholder' },
  { id: '2', type: 'symptom', time: '14:30', severity: 'Medium', note: 'Stomach ache', icon: 'Alert' },
  { id: '3', type: 'meal', time: '19:00', title: 'Dinner: Salad', tags: ['Lettuce', 'Tomato', 'Dressing'], image: 'placeholder' },
  { id: '4', type: 'meal', time: '08:00', title: 'Breakfast: Toast', tags: ['Wheat', 'Butter'], image: 'placeholder' },
];

export default function HomeScreen() {
  const router = useRouter();

  const renderItem = ({ item }: { item: any }) => (
    <View className={`mb-4 p-4 rounded-2xl shadow-sm mx-4 ${item.type === 'symptom' ? 'bg-red-50 border border-red-100' : 'bg-white'}`}>
      <View className="flex-row items-start">
        <View className="mr-4 pt-1">
          <Text className="text-gray-500 font-medium">{item.time}</Text>
          {/* Timeline dot/line could go here */}
        </View>

        <View className="flex-1">
          {item.type === 'meal' ? (
            <View>
              <Text className="text-lg font-bold text-gray-800">{item.title}</Text>
              <View className="flex-row flex-wrap mt-1 mb-2">
                {item.tags.map((tag: string, idx: number) => (
                  <View key={idx} className="bg-gray-100 px-2 py-0.5 rounded-full mr-1 mb-1">
                    <Text className="text-xs text-gray-600">#{tag}</Text>
                  </View>
                ))}
              </View>
              <View className="h-40 bg-gray-200 rounded-xl w-full items-center justify-center">
                <Text className="text-gray-400">Meal Image</Text>
              </View>
            </View>
          ) : (
            <View>
              <View className="flex-row items-center mb-1">
                <Text className="text-lg font-bold text-accent">Stomach Ache</Text>
                <View className="ml-2 bg-accent/20 px-2 py-0.5 rounded-full">
                  <Text className="text-xs font-bold text-accent">{item.severity}</Text>
                </View>
              </View>
              <Text className="text-gray-600">{item.note}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <View className="px-6 py-4 bg-white border-b border-gray-100 mb-2 flex-row justify-between items-center">
        <Text className="text-2xl font-extrabold text-primary">Foody Note</Text>
      </View>

      <FlatList
        data={MOCK_DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
      />

      {/* Double FAB */}
      <View className="absolute bottom-6 right-6 items-end gap-y-3">
        <TouchableOpacity
          onPress={() => router.push('/(app)/symptom')}
          className="flex-row items-center bg-accent px-5 py-3 rounded-full shadow-lg active:scale-95 transition-transform"
        >
          <Activity color="white" size={20} />
          <Text className="text-white font-bold ml-2">Symptom</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/(app)/meal')}
          className="flex-row items-center bg-primary px-5 py-3 rounded-full shadow-lg active:scale-95 transition-transform"
        >
          <Camera color="white" size={20} />
          <Text className="text-white font-bold ml-2">Meal</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
