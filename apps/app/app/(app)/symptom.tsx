import { View, Text, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Frown, Meh, AlertCircle, Save, Calendar as CalendarIcon, Clock, Droplets, Zap, Moon } from 'lucide-react-native';

// ... (rest of imports)

// ... inside component

import { useState, useEffect } from 'react';
import { useAddSymptom, useUpdateSymptom, useSymptoms } from '../../hooks/useSymptoms';
import { SymptomType, SeverityLevel } from '../../types';
import { useTranslation } from 'react-i18next';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

export default function SymptomScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const isEditing = !!params.id;

  const addSymptom = useAddSymptom();
  const updateSymptom = useUpdateSymptom();
  const { data: symptoms } = useSymptoms();
  const { t, i18n } = useTranslation();

  const [type, setType] = useState<SymptomType>('bloated');
  const [severity, setSeverity] = useState<SeverityLevel>('medium');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mode, setMode] = useState<'date' | 'time'>('date');

  useEffect(() => {
    if (isEditing && symptoms) {
      const existing = symptoms.find(s => s.id === params.id);
      if (existing) {
        setType(existing.type);
        setSeverity(existing.severity);
        setNote(existing.note || '');
        setDate(new Date(existing.timestamp));
      }
    }
  }, [isEditing, params.id, symptoms]);

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

  const handleSave = () => {
    const symptomData = {
      type,
      severity,
      note,
      timestamp: date.toISOString()
    };

    if (isEditing && params.id) {
      updateSymptom.mutate({
        id: params.id,
        updates: symptomData
      }, {
        onSuccess: () => router.back(),
        onError: (err) => Alert.alert("Error", "Failed to update symptom")
      });
    } else {
      addSymptom.mutate(symptomData, {
        onSuccess: () => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/');
          }
        },
        onError: (err) => Alert.alert("Error", "Failed to add symptom")
      });
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-white">
      <ScrollView className="p-6">
        <Text className="text-xl font-bold text-gray-800 mb-6">
          {isEditing ? t('symptom.editTitle', 'Edit Symptom') : t('symptom.question')}
        </Text>

        <View className="mb-6">
          <Text className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">{t('common.date', 'Date & Time')}</Text>
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

        <View className="flex-row flex-wrap gap-3 mb-8">
          <OptionButton
            selected={type === 'pain'}
            onPress={() => setType('pain')}
            label={t('symptoms.types.pain')}
            color="text-red-600 font-bold"
            icon={<Zap size={40} color="#ef4444" />}
            bg="bg-gray-50"
            activeBg="bg-red-50 border-red-200"
          />
          <OptionButton
            selected={type === 'bloated'}
            onPress={() => setType('bloated')}
            label={t('symptoms.types.bloated')}
            color="text-yellow-600 font-medium"
            icon={<Meh size={40} color="#fbbf24" />}
            bg="bg-gray-50"
            activeBg="bg-yellow-50 border-yellow-200"
          />
          <OptionButton
            selected={type === 'diarrhea'}
            onPress={() => setType('diarrhea')}
            label={t('symptoms.types.diarrhea')}
            color="text-blue-500 font-medium"
            icon={<Droplets size={40} color="#3b82f6" />}
            bg="bg-gray-50"
            activeBg="bg-blue-50 border-blue-200"
          />
          <OptionButton
            selected={type === 'nausea'}
            onPress={() => setType('nausea')}
            label={t('symptoms.types.nausea')}
            color="text-green-600 font-medium"
            icon={<AlertCircle size={40} color="#10b981" />}
            bg="bg-gray-50"
            activeBg="bg-green-50 border-green-200"
          />
          <OptionButton
            selected={type === 'tired'}
            onPress={() => setType('tired')}
            label={t('symptoms.types.tired')}
            color="text-purple-600 font-medium"
            icon={<Moon size={40} color="#9333ea" />}
            bg="bg-gray-50"
            activeBg="bg-purple-50 border-purple-200"
          />
          <OptionButton
            selected={type === 'other'}
            onPress={() => setType('other')}
            label={t('symptoms.types.other')}
            color="text-gray-600 font-medium"
            icon={<AlertCircle size={40} color="#9ca3af" />}
            bg="bg-gray-50"
            activeBg="bg-gray-100 border-gray-300"
          />
        </View>

        <Text className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">{t('symptom.severityLabel')}</Text>
        <View className="flex-row bg-gray-100 p-1 rounded-xl mb-8">
          <SeverityButton label={t('symptoms.severities.mild')} value="mild" current={severity} onSelect={setSeverity} />
          <SeverityButton label={t('symptoms.severities.moderate')} value="medium" current={severity} onSelect={setSeverity} />
          <SeverityButton label={t('symptoms.severities.severe')} value="severe" current={severity} onSelect={setSeverity} />
        </View>

        <Text className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">{t('symptom.notesLabel')}</Text>
        <TextInput
          className="bg-gray-50 p-4 rounded-xl text-gray-800 h-32 border border-gray-200 mb-8"
          placeholder={t('symptom.notesPlaceholder')}
          multiline
          textAlignVertical="top"
          value={note}
          onChangeText={setNote}
        />

        <TouchableOpacity
          onPress={handleSave}
          disabled={addSymptom.isPending}
          className={`w-full bg-accent py-4 rounded-xl items-center shadow-lg active:scale-95 transition-transform ${addSymptom.isPending ? 'opacity-70' : ''}`}
        >
          {addSymptom.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <View className="flex-row items-center">
              <Save size={20} color="white" />
              <Text className="text-white font-bold text-lg ml-2">
                {isEditing ? t('common.update', 'Update') : t('symptom.saveBtn')}
              </Text>
            </View>
          )}
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function OptionButton({ selected, onPress, label, color, icon, bg, activeBg }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`items-center p-4 rounded-2xl w-[48%] border ${selected ? `${activeBg} border-2` : `${bg} border-gray-100`}`}
    >
      {icon}
      <Text className={`mt-2 ${selected ? color : 'text-gray-500 font-medium'}`}>{label}</Text>
    </TouchableOpacity>
  );
}

function SeverityButton({ label, value, current, onSelect }: any) {
  const isSelected = current === value;
  return (
    <TouchableOpacity
      onPress={() => onSelect(value)}
      className={`flex-1 py-3 items-center rounded-lg ${isSelected ? 'bg-white' : ''}`}
    >
      <Text className={isSelected ? 'text-gray-800 font-bold' : 'text-gray-500 font-medium'}>{label}</Text>
    </TouchableOpacity>
  );
}
