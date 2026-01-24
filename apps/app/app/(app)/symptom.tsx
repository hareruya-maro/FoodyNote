import { View, Text, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Frown, Meh, AlertCircle, Save } from 'lucide-react-native';
import { useState } from 'react';
import { useAddSymptom } from '../../hooks/useSymptoms';
import { SymptomType, SeverityLevel } from '../../types';
import { useTranslation } from 'react-i18next';

export default function SymptomScreen() {
  const router = useRouter();
  const addSymptom = useAddSymptom();
  const { t } = useTranslation();

  const [type, setType] = useState<SymptomType>('bloated');
  const [severity, setSeverity] = useState<SeverityLevel>('medium');
  const [note, setNote] = useState('');

  const handleSave = () => {
    addSymptom.mutate({
      type,
      severity,
      note
    }, {
      onSuccess: () => {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/');
        }
      }
    });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-white">
      <ScrollView className="p-6">
        <Text className="text-xl font-bold text-gray-800 mb-6">{t('symptom.question')}</Text>

        <View className="flex-row justify-between mb-8">
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
            selected={type === 'pain'}
            onPress={() => setType('pain')}
            label={t('symptoms.types.pain')}
            color="text-red-600 font-bold"
            icon={<Frown size={40} color="#ef4444" />}
            bg="bg-gray-50"
            activeBg="bg-red-50 border-red-200"
          />
          <OptionButton
            selected={type === 'nausea'}
            onPress={() => setType('nausea')}
            label={t('symptoms.types.nausea')}
            color="text-blue-600 font-medium"
            icon={<AlertCircle size={40} color="#3b82f6" />}
            bg="bg-gray-50"
            activeBg="bg-blue-50 border-blue-200"
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
              <Text className="text-white font-bold text-lg ml-2">{t('symptom.saveBtn')}</Text>
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
      className={`items-center p-4 rounded-2xl w-[30%] border ${selected ? `${activeBg} border-2` : `${bg} border-gray-100`}`}
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
      className={`flex-1 py-3 items-center rounded-lg ${isSelected ? 'bg-white shadow-sm' : ''}`}
    >
      <Text className={isSelected ? 'text-gray-800 font-bold' : 'text-gray-500 font-medium'}>{label}</Text>
    </TouchableOpacity>
  );
}
