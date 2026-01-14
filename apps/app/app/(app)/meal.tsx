import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Camera, Check, Plus } from 'lucide-react-native';
import { useState } from 'react';

// S03: Meal Entry Flow
export default function MealScreen() {
    const router = useRouter();
    const [photoSelected, setPhotoSelected] = useState(false);

    return (
        <View className="flex-1 bg-gray-50">

            {!photoSelected ? (
                // S03-1: Photo Selection
                <View className="flex-1 items-center justify-center p-6">
                    <Text className="text-xl font-bold text-gray-700 mb-8 text-center">Take a photo of your meal</Text>

                    <TouchableOpacity
                        onPress={() => setPhotoSelected(true)}
                        className="w-40 h-40 bg-gray-200 rounded-full items-center justify-center mb-6 shadow-sm border-2 border-dashed border-gray-400"
                    >
                        <Camera size={48} color="#9ca3af" />
                        <Text className="text-gray-500 mt-2 font-medium">Tap to Snap</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="bg-white px-6 py-3 rounded-full shadow-sm border border-gray-200">
                        <Text className="text-gray-600 font-medium">Select from Library</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                // S03-2: Analysis Review (Mock)
                <ScrollView className="flex-1 p-6">
                    <View className="h-64 bg-gray-300 rounded-2xl mb-6 items-center justify-center overflow-hidden">
                        <Text className="text-gray-500">Photo Preview</Text>
                    </View>

                    <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">AI Analysis Result</Text>

                    <View className="bg-white p-5 rounded-2xl shadow-sm mb-6">
                        <Text className="text-xl font-bold text-gray-800 mb-1">Spaghetti Carbonara</Text>
                        <Text className="text-gray-400 text-sm mb-4">Detected 5 ingredients</Text>

                        <View className="flex-row flex-wrap gap-2">
                            {['Pasta', 'Bacon', 'Egg', 'Black Pepper', 'Cheese'].map((tag, i) => (
                                <View key={i} className="bg-green-50 px-3 py-1.5 rounded-full flex-row items-center border border-green-100">
                                    <Text className="text-green-800 text-sm font-medium mr-1">#{tag}</Text>
                                </View>
                            ))}
                            <TouchableOpacity className="bg-gray-100 px-3 py-1.5 rounded-full flex-row items-center border border-dashed border-gray-300">
                                <Plus size={14} color="#6b7280" />
                                <Text className="text-gray-500 text-sm font-medium ml-1">Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-full bg-primary py-4 rounded-xl items-center shadow-lg active:scale-95 transition-transform"
                    >
                        <View className="flex-row items-center">
                            <Check text-white size={20} color="white" />
                            <Text className="text-white font-bold text-lg ml-2">Save Record</Text>
                        </View>
                    </TouchableOpacity>

                    <View className="h-20" />
                </ScrollView>
            )}
        </View>
    );
}
