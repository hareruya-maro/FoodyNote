import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';

export default function DoctorScreen() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-white">
            <SafeAreaView className="flex-1">
                <View className="px-6 py-4 border-b border-gray-200 flex-row justify-between items-center bg-gray-50">
                    <View>
                        <Text className="text-sm font-bold text-gray-500 uppercase">Foody Note Report</Text>
                        <Text className="text-2xl font-bold text-gray-800">Review Summary</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center"
                    >
                        <X color="#374151" size={24} />
                    </TouchableOpacity>
                </View>

                <ScrollView className="flex-1 p-6">
                    <View className="flex-row gap-4 mb-6">
                        <View className="flex-1 bg-red-50 p-4 rounded-xl border border-red-100">
                            <Text className="text-red-500 font-medium">Recorded Symptoms</Text>
                            <Text className="text-3xl font-bold text-red-800 mt-2">12</Text>
                            <Text className="text-xs text-red-400">Last 30 days</Text>
                        </View>
                        <View className="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <Text className="text-gray-500 font-medium">Avg Lag Time</Text>
                            <Text className="text-3xl font-bold text-gray-800 mt-2">2.5h</Text>
                            <Text className="text-xs text-gray-400">Eating to Symptom</Text>
                        </View>
                    </View>

                    <Text className="text-lg font-bold text-gray-800 mb-4">Correlated Ingredients</Text>
                    <View className="border border-gray-200 rounded-xl overflow-hidden mb-8">
                        <View className="flex-row bg-gray-100 p-3 border-b border-gray-200">
                            <Text className="flex-1 font-bold text-gray-600">Ingredient</Text>
                            <Text className="w-20 font-bold text-gray-600 text-center">Count</Text>
                            <Text className="w-20 font-bold text-gray-600 text-center">Prob</Text>
                        </View>
                        {[
                            { name: 'Milk / Cream', count: 5, prob: 'High' },
                            { name: 'Wheat', count: 4, prob: 'High' },
                            { name: 'Garlic', count: 2, prob: 'Med' },
                        ].map((row, i) => (
                            <View key={i} className="flex-row p-4 border-b border-gray-100 bg-white">
                                <Text className="flex-1 text-gray-800 font-medium">{row.name}</Text>
                                <Text className="w-20 text-gray-600 text-center">{row.count}</Text>
                                <Text className={`w-20 font-bold text-center ${row.prob === 'High' ? 'text-red-500' : 'text-orange-400'}`}>{row.prob}</Text>
                            </View>
                        ))}
                    </View>

                    <Text className="text-lg font-bold text-gray-800 mb-4">Recent Episodes</Text>
                    <View className="gap-2">
                        {[1, 2, 3].map(i => (
                            <Text key={i} className="text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                • Jan {15 - i}: Stomach ache (Medium) 3h after Pasta
                            </Text>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
