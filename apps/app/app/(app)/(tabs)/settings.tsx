import { useRouter } from 'expo-router';
import { Check, ChevronRight, Globe, LogOut, Stethoscope, User } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSession } from '../../../ctx';
import { changeLanguage } from '../../../i18n';

export default function SettingsScreen() {
    const router = useRouter();
    const { signOut } = useSession();
    const { t, i18n } = useTranslation();

    const currentLanguage = i18n.language;

    const handleLanguageChange = (lang: string) => {
        changeLanguage(lang);
    };

    const handleSignOut = () => {
        signOut();
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
            <View className="px-6 py-4 bg-white border-b border-gray-100">
                <Text className="text-2xl font-bold text-gray-800">{t('settings.title')}</Text>
            </View>

            <ScrollView className="flex-1 p-6">

                {/* Doctor Mode Banner */}
                <TouchableOpacity
                    onPress={() => router.push('/(app)/doctor')}
                    className="bg-primary rounded-2xl p-6 mb-8 shadow-lg flex-row items-center active:opacity-90"
                >
                    <View className="bg-white/20 p-3 rounded-full mr-4">
                        <Stethoscope color="white" size={32} />
                    </View>
                    <View className="flex-1">
                        <Text className="text-white text-lg font-bold">{t('settings.doctorMode.title')}</Text>
                        <Text className="text-teal-100 text-sm mt-1">{t('settings.doctorMode.description')}</Text>
                    </View>
                    <ChevronRight color="white" size={24} />
                </TouchableOpacity>

                <Text className="text-gray-500 font-bold mb-4 uppercase text-xs tracking-wider">{t('settings.preferences')}</Text>
                <View className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
                    <TouchableOpacity
                        className="p-4 border-b border-gray-100 flex-row items-center"
                        onPress={() => handleLanguageChange('en')}
                    >
                        <Globe size={20} color="#4b5563" />
                        <Text className="text-gray-700 ml-3 text-base flex-1">English</Text>
                        {currentLanguage === 'en' && <Check size={20} color="#009688" />}
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="p-4 flex-row items-center"
                        onPress={() => handleLanguageChange('ja')}
                    >
                        <Globe size={20} color="#4b5563" />
                        <Text className="text-gray-700 ml-3 text-base flex-1">日本語</Text>
                        {currentLanguage === 'ja' && <Check size={20} color="#009688" />}
                    </TouchableOpacity>
                </View>

                <Text className="text-gray-500 font-bold mb-4 uppercase text-xs tracking-wider">{t('settings.account')}</Text>

                <View className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
                    <TouchableOpacity
                        className="p-4 border-b border-gray-100 flex-row items-center"
                        onPress={() => router.push('/(app)/profile')}
                    >
                        <User size={20} color="#4b5563" />
                        <Text className="text-gray-700 ml-3 text-base flex-1">{t('settings.profile')}</Text>
                        <ChevronRight size={20} color="#9ca3af" />
                    </TouchableOpacity>
                    <TouchableOpacity className="p-4 flex-row items-center" onPress={handleSignOut}>
                        <LogOut size={20} color="#ef4444" />
                        <Text className="text-red-500 ml-3 text-base flex-1">{t('settings.signOut')}</Text>
                    </TouchableOpacity>
                </View>

                <Text className="text-gray-400 text-center text-xs mt-10">Foody Note v0.1.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}
