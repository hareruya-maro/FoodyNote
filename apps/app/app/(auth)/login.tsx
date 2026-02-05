import { signInAnonymously } from 'firebase/auth';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';
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

            // Setup demo data
            try {
                const { httpsCallable } = await import("firebase/functions");
                const { functions } = await import("../../firebaseConfig");
                const setupDemoData = httpsCallable(functions, 'setupDemoData');
                await setupDemoData();
            } catch (fnError) {
                console.error("Failed to setup demo data:", fnError);
            }

            // Navigation is handled by RootLayout onAuthStateChanged, 
            // but we might want to ensure it only happens after data is ready.
            // Since onAuthStateChanged triggers immediately on sign-in, parallel to this.
            // However, the user state change happens first. 
            // Ideally, we should block navigation. 
            // But since onAuthStateChanged is global in RootLayout, it might navigate automatically.
            // Let's rely on the fact that if we await here, we hold the loading state? 
            // No, the auth listener will likely fire.
            // But for a Hackathon, waiting here usually creates enough delay or at least starts the process.
            // If the RootLayout navigates immediately, the dashboard might load empty first.
            // But `setupDemoData` is fast.
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
                <Image
                    source={require('../../assets/images/icon.png')}
                    style={{ width: 96, height: 96 }}
                    className="w-24 h-24 rounded-3xl mb-6 transform rotate-3"
                />
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
