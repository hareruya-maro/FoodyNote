import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Check, Plus, X } from 'lucide-react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { analyzeImage } from '../../services/mockAi';
import { useSetAtom } from 'jotai';
import { addMealAtom } from '../../store/mealsAtom';

export default function MealScreen() {
    const router = useRouter();
    const addMeal = useSetAtom(addMealAtom);

    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [tags, setTags] = useState<string[]>([]);

    const pickImage = async () => {
        // Request permission (optional for simplified mock, but good practice)
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setPhotoUri(result.assets[0].uri);
            startAnalysis(result.assets[0].uri);
        }
    };

    const startAnalysis = async (uri: string) => {
        setIsAnalyzing(true);
        try {
            const detectedTags = await analyzeImage(uri);
            setTags(detectedTags);
        } catch (e) {
            console.error(e);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSave = () => {
        if (photoUri) {
            addMeal({
                title: 'New Meal', // Could allow editing title
                imageUri: photoUri,
                tags: tags,
            });
            router.back();
        }
    };

    return (
        <View className="flex-1 bg-gray-50">

            {!photoUri ? (
                // S03-1: Photo Selection
                <View className="flex-1 items-center justify-center p-6 bg-white">
                    <Text className="text-xl font-bold text-gray-700 mb-8 text-center">Take a photo of your meal</Text>

                    <TouchableOpacity
                        onPress={() => { /* Mock Camera trigger or just use picker for now */ pickImage(); }}
                        className="w-40 h-40 bg-gray-50 rounded-full items-center justify-center mb-6 shadow-sm border-2 border-dashed border-gray-300"
                    >
                        <Camera size={48} color="#9ca3af" />
                        <Text className="text-gray-500 mt-2 font-medium">Tap to Snap</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={pickImage}
                        className="bg-white px-6 py-3 rounded-full shadow-sm border border-gray-200"
                    >
                        <Text className="text-gray-600 font-medium">Select from Library</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                // S03-2: Analysis Review
                <ScrollView className="flex-1 p-6">
                    <View className="h-64 bg-gray-200 rounded-2xl mb-6 items-center justify-center overflow-hidden relative shadow-sm">
                        <Image source={{ uri: photoUri }} className="w-full h-full" />
                        <TouchableOpacity
                            onPress={() => setPhotoUri(null)}
                            className="absolute top-4 right-4 bg-black/50 p-2 rounded-full"
                        >
                            <X color="white" size={20} />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest">AI Analysis Result</Text>
                        {isAnalyzing && <ActivityIndicator size="small" color="#009688" />}
                    </View>

                    <View className="bg-white p-5 rounded-2xl shadow-sm mb-6">
                        <Text className="text-xl font-bold text-gray-800 mb-1">Detected Meal</Text>
                        <Text className="text-gray-400 text-sm mb-4">{isAnalyzing ? 'Analyzing ingredients...' : `Detected ${tags.length} ingredients`}</Text>

                        <View className="flex-row flex-wrap gap-2">
                            {tags.map((tag, i) => (
                                <View key={i} className="bg-green-50 px-3 py-1.5 rounded-full flex-row items-center border border-green-100">
                                    <Text className="text-green-800 text-sm font-medium mr-1">#{tag}</Text>
                                    <TouchableOpacity onPress={() => setTags(tags.filter(t => t !== tag))}>
                                        <X size={14} color="#166534" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                            {!isAnalyzing && (
                                <TouchableOpacity className="bg-gray-100 px-3 py-1.5 rounded-full flex-row items-center border border-dashed border-gray-300">
                                    <Plus size={14} color="#6b7280" />
                                    <Text className="text-gray-500 text-sm font-medium ml-1">Add</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={handleSave}
                        disabled={isAnalyzing}
                        className={`w-full py-4 rounded-xl items-center shadow-lg transition-transform ${isAnalyzing ? 'bg-gray-300' : 'bg-primary active:scale-95'}`}
                    >
                        <View className="flex-row items-center">
                            <Check color="white" size={20} />
                            <Text className="text-white font-bold text-lg ml-2">Save Record</Text>
                        </View>
                    </TouchableOpacity>

                    <View className="h-20" />
                </ScrollView>
            )}
        </View>
    );
}
