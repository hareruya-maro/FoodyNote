import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signInAnonymously } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useState } from 'react';

export default function Login() {
    const [loading, setLoading] = useState(false);

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

    return (
        <SafeAreaView className="flex-1 bg-white items-center justify-center p-6">
            <View className="items-center mb-12">
                <View className="w-24 h-24 bg-primary rounded-3xl items-center justify-center mb-6 shadow-md transform rotate-3">
                    <Text className="text-white text-5xl font-bold">Fn</Text>
                </View>
                <Text className="text-3xl font-extrabold text-gray-900 tracking-tight">Foody Note</Text>
                <Text className="text-base text-gray-500 mt-3 text-center leading-6 px-4">
                    Discover the hidden causes of your upset stomach with just a photo.
                </Text>
            </View>

            <TouchableOpacity
                onPress={handlePress}
                disabled={loading}
                className="w-full bg-primary py-4 rounded-2xl items-center shadow-lg active:scale-95 transition-transform"
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white font-bold text-lg">Agree & Start</Text>
                )}
            </TouchableOpacity>

            <Text className="text-xs text-gray-400 mt-8 text-center px-8 leading-4">
                By continuing, you agree that this app is not a medical device and should not replace professional medical advice.
            </Text>
        </SafeAreaView>
    );
}
