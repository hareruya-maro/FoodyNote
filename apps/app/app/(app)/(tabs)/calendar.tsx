import { useState, useMemo } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import { format } from 'date-fns';
import { useMeals } from '../../../hooks/useMeals';
import { useSymptoms } from '../../../hooks/useSymptoms';
import { TimelineItem } from '../../../components/TimelineItem';

// Configure Japanese locale
LocaleConfig.locales['jp'] = {
  monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  dayNames: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
  dayNamesShort: ['日', '月', '火', '水', '木', '金', '土'],
  today: '今日'
};
LocaleConfig.defaultLocale = 'jp';

export default function CalendarScreen() {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const { data: meals, isLoading: mealsLoading } = useMeals();
  const { data: symptoms, isLoading: symptomsLoading } = useSymptoms();

  const markedDates = useMemo(() => {
    const marks: any = {};

    // Mark dates with meals
    meals?.forEach(meal => {
      const date = format(new Date(meal.timestamp), 'yyyy-MM-dd');
      if (!marks[date]) marks[date] = { dots: [] };
      if (!marks[date].dots.find((d: any) => d.color === '#009688')) {
        marks[date].dots.push({ key: 'meal', color: '#009688' });
      }
    });

    // Mark dates with symptoms
    symptoms?.forEach(symptom => {
      const date = format(new Date(symptom.timestamp), 'yyyy-MM-dd');
      if (!marks[date]) marks[date] = { dots: [] };
      if (!marks[date].dots.find((d: any) => d.color === '#ef4444')) {
        marks[date].dots.push({ key: 'symptom', color: '#ef4444' });
      }
    });

    // Check if selectedDate exists in marks to preserve dots
    const currentMark = marks[selectedDate] || {};

    marks[selectedDate] = {
      ...currentMark,
      selected: true,
      selectedColor: '#009688'
    };

    return marks;
  }, [meals, symptoms, selectedDate]);

  const selectedDayItems = useMemo(() => {
    if (!meals || !symptoms) return [];

    const dayStart = new Date(selectedDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(selectedDate);
    dayEnd.setHours(23, 59, 59, 999);

    const dayMeals = meals.filter(m => {
      const d = new Date(m.timestamp);
      return d >= dayStart && d <= dayEnd;
    }).map(m => ({ type: 'meal' as const, data: m, timestamp: m.timestamp }));

    const daySymptoms = symptoms.filter(s => {
      const d = new Date(s.timestamp);
      return d >= dayStart && d <= dayEnd;
    }).map(s => ({ type: 'symptom' as const, data: s, timestamp: s.timestamp }));

    return [...dayMeals, ...daySymptoms].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [meals, symptoms, selectedDate]);


  if (mealsLoading || symptomsLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#009688" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="px-6 py-4 border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-800">{t('calendar.history')}</Text>
      </View>

      <Calendar
        current={selectedDate}
        onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        markingType={'multi-dot'}
        theme={{
          todayTextColor: '#009688',
          selectedDayBackgroundColor: '#009688',
          arrowColor: '#009688',
          dotColor: '#009688',
        }}
      />

      <View className="flex-1 bg-gray-50 pt-4">
        <View className="px-6 pb-2">
          <Text className="text-gray-500 font-bold text-lg">
            {format(new Date(selectedDate), 'MMM d, yyyy')}
          </Text>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {selectedDayItems.length > 0 ? (
            selectedDayItems.map((item, index) => (
              <TimelineItem key={`${item.type}-${item.timestamp}-${index}`} item={item} />
            ))
          ) : (
            <View className="items-center justify-center py-10">
              <Text className="text-gray-400">{t('calendar.noEvents', 'No events for this day')}</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

