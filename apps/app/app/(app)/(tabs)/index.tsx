import { deleteField } from 'firebase/firestore';
// ... (I need to ensure imports are correct, easier to just add the logic block and let imports be handled or assume basics present. 
// Actually, I'll rewrite the component part largely to include the header)

// To be safe and avoid "missing imports" errors:
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native'; // Added Alert
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Activity, Frown, Meh, AlertCircle, HelpCircle } from 'lucide-react-native'; // Added HelpCircle
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { useMeals, useUpdateMeal } from '../../../hooks/useMeals'; // Added useUpdateMeal
import { useSymptoms } from '../../../hooks/useSymptoms';
import { MealRecord, SymptomRecord } from '../../../types';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

type TimelineItem = {
  type: 'meal' | 'symptom';
  data: MealRecord | SymptomRecord;
  timestamp: string;
};

export default function HomeScreen() {
  const router = useRouter();
  const { data: meals, isLoading: mealsLoading } = useMeals();
  const { data: symptoms, isLoading: symptomsLoading } = useSymptoms();
  const updateMeal = useUpdateMeal();
  const { t } = useTranslation();

  const timelineData = useMemo(() => {
    if (!meals || !symptoms) return [];

    const combined: TimelineItem[] = [
      ...meals.map(m => ({ type: 'meal' as const, data: m, timestamp: m.timestamp })),
      ...symptoms.map(s => ({ type: 'symptom' as const, data: s, timestamp: s.timestamp })),
    ];
    return combined.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [meals, symptoms]);

  const pendingInquiries = useMemo(() => {
    return meals?.filter(m => m.activeInquiry) || [];
  }, [meals]);

  const handleAnswerInquiry = async (meal: MealRecord, option: { label: string, tags: string[] }) => {
    // Merge tags
    const currentTags = meal.tags || [];
    const newTags = [...currentTags];
    option.tags.forEach(tag => {
      if (!newTags.includes(tag)) newTags.push(tag);
    });

    try {
      await updateMeal.mutateAsync({
        id: meal.id,
        // @ts-ignore: deleteField type compatibility
        updates: {
          tags: newTags,
          activeInquiry: deleteField()
        }
      });
    } catch (e) {
      Alert.alert("Error", "Failed to update meal.");
    }
  };

  const renderActiveInquiry = ({ item }: { item: MealRecord }) => (
    <View key={item.id} className="bg-white mx-4 mb-4 p-5 rounded-2xl shadow-sm border-l-4 border-yellow-400">
      <View className="flex-row items-center mb-2">
        <HelpCircle size={20} color="#eab308" />
        <Text className="text-yellow-600 font-bold ml-2">Confirmation Needed</Text>
        <Text className="text-gray-400 text-xs ml-auto">{format(new Date(item.timestamp), 'HH:mm')} • {item.title}</Text>
      </View>
      <Text className="text-gray-800 font-medium mb-4 text-lg">{item.activeInquiry?.question}</Text>
      <View className="flex-row gap-2 flex-wrap">
        {item.activeInquiry?.options.map((opt, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => handleAnswerInquiry(item, opt)}
            className="bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-100 mb-1"
          >
            <Text className="text-yellow-800 font-bold">{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderItem = ({ item }: { item: TimelineItem }) => {
    const isMeal = item.type === 'meal';
    const date = new Date(item.timestamp);
    const timeStr = format(date, 'HH:mm');
    const meal = isMeal ? (item.data as MealRecord) : null;

    // If meal has active inquiry, show it in the list? 
    // Spec says "Timeline Top". So we probably shouldn't show the inquiry *inside* the timeline item 
    // unless the card replaces the normal view. 
    // But the normal view shows "Meal". The inquiry is "Additional info needed".
    // I already implemented the Top Cards in pendingInquiries.
    // So the timeline item remains as "Meal record".

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
                  {/* Indicator if pending inquiry exists for this meal */}
                  {(item.data as MealRecord).activeInquiry && (
                    <View className="bg-yellow-100 px-2 py-0.5 rounded-full mr-1 mb-1 border border-yellow-200">
                      <Text className="text-xs text-yellow-700">? Check top</Text>
                    </View>
                  )}
                </View>
                {(item.data as MealRecord).imageUri && (
                  <View className="h-40 bg-gray-200 rounded-xl w-full items-center justify-center overflow-hidden">
                    <Image source={{ uri: (item.data as MealRecord).imageUri }} className="w-full h-full" resizeMode="cover" />
                  </View>
                )}
              </View>
            ) : (
              // ... (Symptom Item logic unchanged)
              <View>
                <View className="flex-row items-center mb-1">
                  {(item.data as SymptomRecord).type === 'pain' && <Frown size={20} color="#ef4444" />}
                  {(item.data as SymptomRecord).type === 'bloated' && <Meh size={20} color="#ca8a04" />}
                  {(item.data as SymptomRecord).type === 'nausea' && <AlertCircle size={20} color="#3b82f6" />}

                  <Text className="text-lg font-bold text-gray-800 ml-2 capitalize">{t(`symptoms.types.${(item.data as SymptomRecord).type}`, { defaultValue: (item.data as SymptomRecord).type })}</Text>
                  <View className="ml-2 bg-white/50 px-2 py-0.5 rounded-full border border-gray-200">
                    <Text className="text-xs font-bold text-gray-600 capitalize">{t(`symptoms.severities.${(item.data as SymptomRecord).severity}`, { defaultValue: (item.data as SymptomRecord).severity })}</Text>
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
        ListHeaderComponent={
          <View>
            {pendingInquiries.map(meal => renderActiveInquiry({ item: meal }))}
          </View>
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Text className="text-gray-400">{t('home.noRecords')}</Text>
            <Text className="text-gray-400 text-xs mt-1">{t('home.addFirst')}</Text>
          </View>
        }
      />

      <View className="absolute bottom-6 right-6 items-end gap-y-3 z-50">
        <TouchableOpacity
          onPress={() => router.push('/symptom')}
          className="flex-row items-center bg-accent px-5 py-3 rounded-full shadow-lg active:scale-95 transition-transform"
        >
          <Activity color="white" size={20} />
          <Text className="text-white font-bold ml-2">{t('home.buttons.symptom')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/meal')}
          className="flex-row items-center bg-primary px-5 py-3 rounded-full shadow-lg active:scale-95 transition-transform"
        >
          <Camera color="white" size={20} />
          <Text className="text-white font-bold ml-2">{t('home.buttons.meal')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

