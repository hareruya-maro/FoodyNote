import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert, TextInput, Modal, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Camera, Check, Plus, X, Calendar as CalendarIcon, Clock } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../firebaseConfig';
import { useAddMeal, useUpdateMeal, useMeals } from '../../hooks/useMeals';
import { Tag } from '../../types';
import { useTranslation } from 'react-i18next';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

export default function MealScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ id: string }>();
    const isEditing = !!params.id;

    const addMeal = useAddMeal();
    const updateMeal = useUpdateMeal();
    const { data: meals } = useMeals();
    const { t, i18n } = useTranslation();

    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const [photoBase64, setPhotoBase64] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [tags, setTags] = useState<Tag[]>([]);
    const [dishName, setDishName] = useState('');
    const [analysisDone, setAnalysisDone] = useState(false);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [mode, setMode] = useState<'date' | 'time'>('date');

    // Active Inquiry State
    const [activeInquiry, setActiveInquiry] = useState<{ question: string, options: { label: string, tags: Tag[] }[] } | null>(null);
    const [showInquiryModal, setShowInquiryModal] = useState(false);

    useEffect(() => {
        if (isEditing && meals) {
            const existing = meals.find(m => m.id === params.id);
            if (existing) {
                setPhotoUri(existing.imageUri || null);
                setDishName(existing.title);
                // Backward compatibility check (if old data is string[], force ignore or simple mapping?)
                // User said old data can be ignored, but let's be safe: casting or simple map if needed.
                // Since user said ignore old data, we assume strict type compliance for new/refactored code.
                setTags(existing.tags);
                setAnalysisDone(true);
                setDate(new Date(existing.timestamp));
                if (existing.activeInquiry) {
                    setActiveInquiry(existing.activeInquiry);
                }
            }
        }
    }, [isEditing, params.id, meals]);

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const showMode = (currentMode: 'date' | 'time') => {
        setShowDatePicker(true);
        setMode(currentMode);
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5, // Reduce quality for faster upload/base64
            base64: true,
        });

        if (!result.canceled) {
            setPhotoUri(result.assets[0].uri);
            setPhotoBase64(result.assets[0].base64 || null);
            setAnalysisDone(false);
            setTags([]);
            setDishName('');
            setActiveInquiry(null);
            setShowInquiryModal(false);
        }
    };

    const startAnalysis = async () => {
        if (!photoUri || !photoBase64) return;

        setIsAnalyzing(true);
        setTags([]);
        setActiveInquiry(null);

        try {
            const analyzeFn = httpsCallable(functions, 'analyzeMealImage');

            const response = await analyzeFn({
                imageBase64: photoBase64,
                mimeType: 'image/jpeg',
                dishName: dishName, // Pass user input as hint
                language: i18n.language
            });

            const data = response.data as { dishName: string, ingredients: { id: string, label: string }[], activeInquiry?: { question: string, options: { label: string, tags: { id: string, label: string }[] }[] } };
            setTags(data.ingredients);
            setDishName(data.dishName);
            setAnalysisDone(true);

            if (data.activeInquiry) {
                setActiveInquiry(data.activeInquiry);
                setShowInquiryModal(true);
            }

        } catch (e) {
            console.error(e);
            Alert.alert(t('meal.analysisFailedTitle'), t('meal.analysisFailedMsg'));
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleInquiryAnswer = (option: { label: string, tags: Tag[] }) => {
        // Append new tags, avoiding duplicates
        const newTags = [...tags];
        option.tags.forEach(t => {
            if (!newTags.some(existing => existing.id === t.id)) newTags.push(t);
        });
        setTags(newTags);
        setActiveInquiry(null); // Answered, so remove it
        setShowInquiryModal(false);
    };

    const handleInquiryLater = () => {
        setShowInquiryModal(false);
        // activeInquiry remains in state and will be saved via handleSave
    };

    const handleSave = () => {
        if (photoUri) {
            if (isEditing && params.id) {
                updateMeal.mutate({
                    id: params.id,
                    updates: {
                        title: dishName || 'My Meal',
                        tags: tags,
                        activeInquiry: activeInquiry || undefined,
                        timestamp: date.toISOString()
                        // Note: Handling image update requires re-upload logic, skipping for now as per MVP
                    }
                }, {
                    onSuccess: () => router.back(),
                    onError: (err) => Alert.alert(t('meal.errorTitle'), err.message)
                });
            } else {
                addMeal.mutate({
                    title: dishName || 'My Meal',
                    imageUri: photoUri,
                    tags: tags,
                    activeInquiry: activeInquiry || undefined,
                    timestamp: date.toISOString()
                }, {
                    onSuccess: () => {
                        if (router.canGoBack()) {
                            router.back();
                        } else {
                            router.replace('/');
                        }
                    },
                    onError: (err) => Alert.alert(t('meal.errorTitle'), err.message)
                });
            }
        }
    };

    return (
        <View className="flex-1 bg-gray-50">

            {!photoUri ? (
                <View className="flex-1 items-center justify-center p-6 bg-white">
                    <Text className="text-xl font-bold text-gray-700 mb-8 text-center">{t('meal.takePhoto')}</Text>

                    <TouchableOpacity
                        onPress={() => pickImage()} // In real app, separate Camera vs Library logic
                        className="w-40 h-40 bg-gray-50 rounded-full items-center justify-center mb-6 shadow-sm border-2 border-dashed border-gray-300"
                    >
                        <Camera size={48} color="#9ca3af" />
                        <Text className="text-gray-500 mt-2 font-medium">{t('meal.tapToSnap')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={pickImage}
                        className="bg-white px-6 py-3 rounded-full shadow-sm border border-gray-200"
                    >
                        <Text className="text-gray-600 font-medium">{t('meal.selectFromLibrary')}</Text>
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
                        <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{t('meal.dishNameLabel')}</Text>
                        <TextInput
                            value={dishName}
                            onChangeText={setDishName}
                            placeholder={t('meal.dishNamePlaceholder')}
                            className="text-xl font-bold text-gray-800 border-b border-gray-200 py-2 mb-4"
                        />

                        <View className="mb-4">
                            <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{t('common.date', 'Date & Time')}</Text>
                            {Platform.OS === 'web' ? (
                                <View className="flex-row gap-3">
                                    {/* @ts-ignore */}
                                    <input
                                        type="date"
                                        value={format(date, 'yyyy-MM-dd')}
                                        onChange={(e: any) => {
                                            const newDate = new Date(date);
                                            const [y, m, d] = e.target.value.split('-').map(Number);
                                            newDate.setFullYear(y, m - 1, d);
                                            setDate(newDate);
                                        }}
                                        style={{ padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', flex: 1, fontSize: 16 }}
                                    />
                                    {/* @ts-ignore */}
                                    <input
                                        type="time"
                                        value={format(date, 'HH:mm')}
                                        onChange={(e: any) => {
                                            const newDate = new Date(date);
                                            const [h, m] = e.target.value.split(':').map(Number);
                                            newDate.setHours(h, m);
                                            setDate(newDate);
                                        }}
                                        style={{ padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', flex: 1, fontSize: 16 }}
                                    />
                                </View>
                            ) : Platform.OS === 'ios' ? (
                                <DateTimePicker
                                    value={date}
                                    mode="datetime"
                                    display="compact"
                                    onChange={onDateChange}
                                    locale={i18n.language}
                                />
                            ) : (
                                <>
                                    <View className="flex-row gap-3">
                                        <TouchableOpacity onPress={() => showMode('date')} className="flex-1 flex-row items-center bg-gray-50 p-3 rounded-xl border border-gray-200">
                                            <CalendarIcon size={20} color="#6b7280" />
                                            <Text className="ml-2 text-gray-700 font-medium">{format(date, 'yyyy/MM/dd')}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => showMode('time')} className="flex-1 flex-row items-center bg-gray-50 p-3 rounded-xl border border-gray-200">
                                            <Clock size={20} color="#6b7280" />
                                            <Text className="ml-2 text-gray-700 font-medium">{format(date, 'HH:mm')}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    {showDatePicker && (
                                        <DateTimePicker
                                            value={date}
                                            mode={mode}
                                            is24Hour={true}
                                            onChange={onDateChange}
                                        />
                                    )}
                                </>
                            )}
                        </View>

                        {analysisDone ? (
                            <>
                                <View className="flex-row items-center justify-between mb-3 mt-4">
                                    <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t('meal.detectedIngredients')}</Text>
                                </View>
                                <Text className="text-gray-400 text-sm mb-4">{t('meal.detectedCount', { count: tags.length })}</Text>
                                <View className="flex-row flex-wrap gap-2">
                                    {tags.map((tag, i) => (
                                        <View key={i} className="bg-green-50 px-3 py-1.5 rounded-full flex-row items-center border border-green-100">
                                            <Text className="text-green-800 text-sm font-medium mr-1">#{tag.label}</Text>
                                            <TouchableOpacity onPress={() => setTags(tags.filter(t => t.id !== tag.id))}>
                                                <X size={14} color="#166534" />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                    <TouchableOpacity className="bg-gray-100 px-3 py-1.5 rounded-full flex-row items-center border border-dashed border-gray-300">
                                        <Plus size={14} color="#6b7280" />
                                        <Text className="text-gray-500 text-sm font-medium ml-1">{t('meal.add')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        ) : (
                            <Text className="text-gray-400 text-sm">{t('meal.analyzeHint')}</Text>
                        )}
                    </View>

                    {!analysisDone ? (
                        <TouchableOpacity
                            onPress={startAnalysis}
                            disabled={isAnalyzing}
                            className={`w-full py-4 rounded-xl items-center shadow-lg transition-transform ${isAnalyzing ? 'bg-gray-300' : 'bg-accent active:scale-95'}`}
                        >
                            {isAnalyzing ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <View className="flex-row items-center">
                                    <Text className="text-white font-bold text-lg ml-2">{t('meal.analyzeBtn')}</Text>
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
                                    <Text className="text-white font-bold text-lg ml-2">
                                        {isEditing ? t('common.update', 'Update') : t('meal.saveBtn')}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    )}

                    <View className="h-20" />
                </ScrollView>
            )}

            <Modal
                visible={showInquiryModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowInquiryModal(false)}
            >
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-white rounded-t-3xl p-6 shadow-xl pb-10">
                        <Text className="text-xl font-bold text-gray-800 mb-2">Foody AI Question</Text>
                        <Text className="text-gray-600 mb-6 text-lg leading-relaxed">{activeInquiry?.question}</Text>

                        <View className="flex-row flex-wrap gap-3 justify-center">
                            {activeInquiry?.options.map((option, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    onPress={() => handleInquiryAnswer(option)}
                                    className="bg-teal-50 px-4 py-4 rounded-xl border border-teal-100 min-w-[45%] mb-2 shadow-sm"
                                >
                                    <Text className="text-teal-800 font-bold text-center">{option.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity
                            onPress={handleInquiryLater}
                            className="mt-4 pt-4 border-t border-gray-100"
                        >
                            <Text className="text-gray-400 text-center font-medium">{t('meal.askMeLater', 'Ask me later')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
