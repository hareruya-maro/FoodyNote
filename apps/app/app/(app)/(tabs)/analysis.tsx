import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertTriangle } from 'lucide-react-native';

export default function AnalysisScreen() {
    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
            <View className="px-6 py-4 bg-white border-b border-gray-100">
                <Text className="text-2xl font-bold text-gray-800">Analysis</Text>
            </View>

            <ScrollView className="flex-1 p-6">
                <View className="bg-teal-700 rounded-3xl p-6 mb-8 shadow-lg">
                    <Text className="text-teal-100 font-medium mb-1">Potential Trigger Found</Text>
                    <Text className="text-white text-3xl font-bold mb-4">Wheat & Cream</Text>
                    <Text className="text-teal-50 leading-5">
                        Your data suggests that highly fatty dairy products combined with wheat might be triggering your stomach pain within 2-4 hours.
                    </Text>
                </View>

                <Text className="text-lg font-bold text-gray-800 mb-4">Top Trigger Candidates</Text>

                {[
                    { name: 'Milk / Cream', score: 85, count: 5 },
                    { name: 'Wheat (Gluten)', score: 72, count: 4 },
                    { name: 'Garlic', score: 45, count: 2 }
                ].map((item, i) => (
                    <View key={i} className="bg-white p-5 rounded-2xl mb-3 flex-row items-center border border-gray-100">
                        <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${i === 0 ? 'bg-red-100' : 'bg-gray-100'}`}>
                            <Text className={`font-bold ${i === 0 ? 'text-red-600' : 'text-gray-600'}`}>{i + 1}</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-lg font-bold text-gray-800">{item.name}</Text>
                            <Text className="text-gray-500 text-sm">Associated with {item.count} episodes</Text>
                        </View>
                        <View className="items-end">
                            <Text className="text-lg font-bold text-accent">{item.score}%</Text>
                            <Text className="text-xs text-gray-400">prob.</Text>
                        </View>
                    </View>
                ))}

            </ScrollView>
        </SafeAreaView>
    );
}
