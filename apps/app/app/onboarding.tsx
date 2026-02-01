import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { saveUserProfile } from '../services/userService';
import { userAtom } from '../store/userAtom';
import { UserProfile } from '../types';
import { Check } from 'lucide-react-native';

export default function OnboardingScreen() {
    const [session] = useAtom(userAtom);
    const router = useRouter();
    const { t } = useTranslation();
    const [saving, setSaving] = useState(false);

    const [profile, setProfile] = useState<Partial<UserProfile>>({
        age_group: undefined,
        gender: undefined,
        bowel_type: undefined
    });

    const ageGroups = ["10s", "20s", "30s", "40s", "50s", "60s", "70+"];
    const genders = ["male", "female", "other", "prefer_not_to_say"];
    const bowelTypes = ["diarrhea", "constipation", "mixed", "gas"];

    const handleSave = async () => {
        console.log("handleSave called");
        if (!session?.uid) {
            console.log("No session uid");
            return;
        }
        if (!profile.age_group || !profile.gender || !profile.bowel_type) {
            console.log("Profile incomplete", profile);
            return;
        }

        setSaving(true);
        try {
            console.log("Saving profile...");
            await saveUserProfile(session.uid, profile as UserProfile);
            console.log("Profile saved, navigating...");
            router.replace('/(app)/(tabs)');
        } catch (error) {
            console.error("Save failed", error);
        } finally {
            setSaving(false);
        }
    };

    const isComplete = profile.age_group && profile.gender && profile.bowel_type;

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1 px-6 py-4">
                <Text className="text-3xl font-bold text-teal-800 mb-2">{t('profile.setupTitle')}</Text>
                <Text className="text-gray-500 mb-8">{t('profile.setupDescription')}</Text>

                {/* Age Group */}
                <Text className="text-lg font-bold text-gray-800 mb-3">{t('profile.age')}</Text>
                <View className="flex-row flex-wrap gap-2 mb-6">
                    {ageGroups.map(age => (
                        <TouchableOpacity
                            key={age}
                            onPress={() => setProfile(p => ({ ...p, age_group: age }))}
                            className={`px-4 py-2 rounded-full border ${profile.age_group === age ? 'bg-teal-500 border-teal-500' : 'bg-white border-gray-200'}`}
                        >
                            <Text className={profile.age_group === age ? 'text-white font-bold' : 'text-gray-600'}>{age}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Gender */}
                <Text className="text-lg font-bold text-gray-800 mb-3">{t('profile.gender')}</Text>
                <View className="flex-row flex-wrap gap-2 mb-6">
                    {genders.map(gender => (
                        <TouchableOpacity
                            key={gender}
                            onPress={() => setProfile(p => ({ ...p, gender: gender as any }))}
                            className={`px-4 py-2 rounded-full border ${profile.gender === gender ? 'bg-teal-500 border-teal-500' : 'bg-white border-gray-200'}`}
                        >
                            <Text className={profile.gender === gender ? 'text-white font-bold' : 'text-gray-600'}>{t(`profile.options.gender.${gender}`)}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Bowel Type */}
                <Text className="text-lg font-bold text-gray-800 mb-3">{t('profile.bowelType')}</Text>
                <View className="gap-3 mb-10">
                    {bowelTypes.map(type => (
                        <TouchableOpacity
                            key={type}
                            onPress={() => setProfile(p => ({ ...p, bowel_type: type as any }))}
                            className={`p-4 rounded-xl border flex-row items-center ${profile.bowel_type === type ? 'bg-teal-50 border-teal-500' : 'bg-white border-gray-200'}`}
                        >
                            <View className={`w-6 h-6 rounded-full border mr-3 items-center justify-center ${profile.bowel_type === type ? 'border-teal-500 bg-teal-500' : 'border-gray-300'}`}>
                                {profile.bowel_type === type && <Check size={14} color="white" />}
                            </View>
                            <Text className={`text-base ${profile.bowel_type === type ? 'text-teal-900 font-bold' : 'text-gray-700'}`}>
                                {t(`profile.options.bowel.${type}`)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

            </ScrollView>

            <View className="p-6 border-t border-gray-100">
                <TouchableOpacity
                    onPress={handleSave}
                    disabled={!isComplete || saving}
                    className={`w-full py-4 rounded-2xl items-center shadow-sm ${!isComplete || saving ? 'bg-gray-300' : 'bg-teal-600'}`}
                >
                    {saving ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-lg">{t('profile.save')}</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
