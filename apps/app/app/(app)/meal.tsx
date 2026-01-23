import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Check, Plus, X } from 'lucide-react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../firebaseConfig';
import { File } from 'expo-file-system';
import { useAddMeal } from '../../hooks/useMeals';

export default function MealScreen() {
    const router = useRouter();
    const addMeal = useAddMeal();

    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [dishName, setDishName] = useState('');
    const [analysisDone, setAnalysisDone] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5, // Reduce quality for faster upload/base64
        });

        if (!result.canceled) {
            setPhotoUri(result.assets[0].uri);
            setAnalysisDone(false);
            setTags([]);
            // Do not start analysis automatically
        }
    };

    const startAnalysis = async () => {
        if (!photoUri) return;

        setIsAnalyzing(true);
        setTags([]);
        try {
            const base64 = await new File(photoUri).base64();
            const analyzeFn = httpsCallable(functions, 'analyzeMealImage');

            const response = await analyzeFn({
                imageBase64: base64,
                mimeType: 'image/jpeg',
                dishName: dishName // Pass user input as hint
            });

            const data = response.data as { dishName: string, ingredients: string[] };
            setTags(data.ingredients);
            setDishName(data.dishName);
            setAnalysisDone(true);

        } catch (e) {
            console.error(e);
            Alert.alert("Analysis Failed", "Could not analyze the image. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSave = () => {
        if (photoUri) {
            addMeal.mutate({
                title: dishName || 'My Meal',
                imageUri: photoUri,
                tags: tags,
            }, {
                onSuccess: () => {
                    if (router.canGoBack()) {
                        router.back();
                    } else {
                        router.replace('/');
                    }
                },
                onError: (err) => Alert.alert("Error", err.message)
            });
        }
    };

    return (
        <View className="flex-1 bg-gray-50">

            {!photoUri ? (
                <View className="flex-1 items-center justify-center p-6 bg-white">
                    <Text className="text-xl font-bold text-gray-700 mb-8 text-center">Take a photo of your meal</Text>

                    <TouchableOpacity
                        onPress={() => pickImage()} // In real app, separate Camera vs Library logic
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

                    {/* Pre-Analysis Input View */}
                    <View className="bg-white p-5 rounded-2xl shadow-sm mb-6">
                        <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Dish Name</Text>
                        <TextInput
                            value={dishName}
                            onChangeText={setDishName}
                            placeholder="Enter dish name (Optional)"
                            className="text-xl font-bold text-gray-800 border-b border-gray-200 py-2 mb-4"
                        />

                        {analysisDone ? (
                            <>
                                <View className="flex-row items-center justify-between mb-3 mt-4">
                                    <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest">Detected Ingredients</Text>
                                </View>
                                <Text className="text-gray-400 text-sm mb-4">{`Detected ${tags.length} ingredients`}</Text>
                                <View className="flex-row flex-wrap gap-2">
                                    {tags.map((tag, i) => (
                                        <View key={i} className="bg-green-50 px-3 py-1.5 rounded-full flex-row items-center border border-green-100">
                                            <Text className="text-green-800 text-sm font-medium mr-1">#{tag}</Text>
                                            <TouchableOpacity onPress={() => setTags(tags.filter(t => t !== tag))}>
                                                <X size={14} color="#166534" />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                    <TouchableOpacity className="bg-gray-100 px-3 py-1.5 rounded-full flex-row items-center border border-dashed border-gray-300">
                                        <Plus size={14} color="#6b7280" />
                                        <Text className="text-gray-500 text-sm font-medium ml-1">Add</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        ) : (
                            <Text className="text-gray-400 text-sm">Tap "Analyze Meal" to detect ingredients.</Text>
                        )}
                    </View>

                    {!analysisDone ? (
                        <TouchableOpacity
                            onPress={startAnalysis}
                            disabled={isAnalyzing}
                            className={`w-full py-4 rounded-xl items-center shadow-lg transition-transform ${isAnalyzing ? 'bg-gray-300' : 'bg-secondary active:scale-95'}`}
                        >
                            {isAnalyzing ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <View className="flex-row items-center">
                                    <Text className="text-white font-bold text-lg ml-2">Analyze Meal</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={handleSave}
                            disabled={addMeal.isPending}
                            className={`w-full py-4 rounded-xl items-center shadow-lg transition-transform ${addMeal.isPending ? 'bg-gray-300' : 'bg-primary active:scale-95'}`}
                        >
                            {addMeal.isPending ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <View className="flex-row items-center">
                                    <Check color="white" size={20} />
                                    <Text className="text-white font-bold text-lg ml-2">Save Record</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    )}

                    <View className="h-20" />
                </ScrollView>
            )}
        </View>
    );
}
