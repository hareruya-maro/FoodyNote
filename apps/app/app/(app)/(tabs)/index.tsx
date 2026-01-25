import { deleteField } from 'firebase/firestore';
// ... (I need to ensure imports are correct, easier to just add the logic block and let imports be handled or assume basics present. 
// Actually, I'll rewrite the component part largely to include the header)

// To be safe and avoid "missing imports" errors:
import { View, Text, SectionList, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native'; // Added Alert
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Activity, Frown, Meh, AlertCircle, HelpCircle } from 'lucide-react-native'; // Added HelpCircle
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { useMeals, useUpdateMeal } from '../../../hooks/useMeals'; // Added useUpdateMeal
import { useSymptoms } from '../../../hooks/useSymptoms';
import { MealRecord, SymptomRecord } from '../../../types';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { TimelineItem } from '../../../components/TimelineItem';

type TimelineItemType = {
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

  const sectionData = useMemo(() => {
    if (!meals || !symptoms) return [];

    const combined: TimelineItemType[] = [
      ...meals.map(m => ({ type: 'meal' as const, data: m, timestamp: m.timestamp })),
      ...symptoms.map(s => ({ type: 'symptom' as const, data: s, timestamp: s.timestamp })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const grouped = combined.reduce((acc, item) => {
      const dateKey = format(new Date(item.timestamp), 'yyyy-MM-dd');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(item);
      return acc;
    }, {} as Record<string, TimelineItemType[]>);

    return Object.entries(grouped).map(([date, data]) => ({
      title: date,
      data,
    }));
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
    } catch {
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

  const renderItem = ({ item }: { item: TimelineItemType }) => (
    <TimelineItem item={item} />
  );

  const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
    <View className="px-6 py-2 bg-gray-50/90 backdrop-blur-sm">
      <Text className="text-gray-500 font-bold text-sm uppercase tracking-wider">
        {format(new Date(title), 'MMM d, yyyy')}
      </Text>
    </View>
  );

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

      <SectionList
        sections={sectionData}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item: TimelineItemType, index: number) => item.type + item.timestamp + index}
        contentContainerStyle={{ paddingBottom: 100 }}
        stickySectionHeadersEnabled={true}
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

