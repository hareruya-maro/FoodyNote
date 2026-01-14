import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Frown, Meh, AlertCircle, Save } from 'lucide-react-native';

// S04: Symptom Entry Modal
export default function SymptomScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="p-6">
        <Text className="text-xl font-bold text-gray-800 mb-6">How are you feeling?</Text>

        <View className="flex-row justify-between mb-8">
          <TouchableOpacity className="items-center bg-gray-50 p-4 rounded-2xl w-[30%] border border-gray-100 active:bg-yellow-50">
            <Meh size={40} color="#fbbf24" />
            <Text className="mt-2 font-medium text-gray-600">Bloated</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center bg-red-50 p-4 rounded-2xl w-[30%] border-2 border-red-200">
            <Frown size={40} color="#ef4444" />
            <Text className="mt-2 font-bold text-red-600">Pain</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center bg-gray-50 p-4 rounded-2xl w-[30%] border border-gray-100 active:bg-blue-50">
            <AlertCircle size={40} color="#3b82f6" />
            <Text className="mt-2 font-medium text-gray-600">Nausea</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Severity</Text>
        <View className="flex-row bg-gray-100 p-1 rounded-xl mb-8">
          <TouchableOpacity className="flex-1 py-3 items-center rounded-lg">
            <Text className="text-gray-500 font-medium">Mild</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 py-3 items-center bg-white shadow-sm rounded-lg">
            <Text className="text-gray-800 font-bold">Medium</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 py-3 items-center rounded-lg">
            <Text className="text-gray-500 font-medium">Severe</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Notes</Text>
        <TextInput
          className="bg-gray-50 p-4 rounded-xl text-gray-800 h-32 border border-gray-200 mb-8"
          placeholder="Describe your symptoms (e.g. sharp pain after eating)"
          multiline
          textAlignVertical="top"
        />

        <TouchableOpacity
          onPress={() => router.back()}
          className="w-full bg-accent py-4 rounded-xl items-center shadow-lg active:scale-95 transition-transform"
        >
          <View className="flex-row items-center">
            <Save size={20} color="white" />
            <Text className="text-white font-bold text-lg ml-2">Save Symptom</Text>
          </View>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}
