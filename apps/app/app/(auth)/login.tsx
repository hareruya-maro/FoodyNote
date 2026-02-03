import { signInAnonymously } from 'firebase/auth';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../firebaseConfig';
import { signInWithGoogle } from '../../services/auth/google';

export default function Login() {
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const handlePress = async () => {
        setLoading(true);
        try {
            await signInAnonymously(auth);
            // Navigation handled by RootLayout onAuthStateChanged
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white items-center justify-center p-6">
            <View className="items-center mb-12">
                <View className="w-24 h-24 bg-primary rounded-3xl items-center justify-center mb-6 shadow-md transform rotate-3">
                    <Text className="text-white text-5xl font-bold">Fn</Text>
                </View>
                <Text className="text-3xl font-extrabold text-gray-900 tracking-tight">Foody Note</Text>
                <Text className="text-base text-gray-500 mt-3 text-center leading-6 px-4">
                    {t('login.subtitle')}
                </Text>
            </View>

            <View className="items-center mb-12 w-full p-4">
                <TouchableOpacity
                    onPress={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full bg-white border border-gray-200 py-4 rounded-2xl items-center shadow-sm m-4 mb-4 active:scale-95 transition-transform flex-row justify-center"
                >
                    {/* Google Icon could go here */}
                    <Text className="text-gray-700 font-bold text-lg">Sign in with Google</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handlePress}
                    disabled={loading}
                    className="w-full bg-primary py-4 rounded-2xl items-center shadow-lg active:scale-95 transition-transform"
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-lg">{t('login.startBtn')}</Text>
                    )}
                </TouchableOpacity>
            </View>

            <Text className="text-xs text-gray-400 mt-8 text-center px-8 leading-4">
                {t('login.disclaimer')}
            </Text>
        </SafeAreaView>
    );
}
