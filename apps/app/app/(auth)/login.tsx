import { View, Text, TouchableOpacity } from 'react-native';
import { useSession } from '../../ctx';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Login() {
    const { signIn } = useSession();
    const router = useRouter();

    const handlePress = () => {
        signIn();
        // Navigate after sign in
        router.replace('/');
    };

    return (
        <SafeAreaView className="flex-1 bg-white items-center justify-center p-6">
            <View className="items-center mb-12">
                {/* Logo placeholder */}
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
                className="w-full bg-primary py-4 rounded-2xl items-center shadow-lg active:scale-95 transition-transform"
            >
                <Text className="text-white font-bold text-lg">Agree & Start</Text>
            </TouchableOpacity>

            <Text className="text-xs text-gray-400 mt-8 text-center px-8 leading-4">
                By continuing, you agree that this app is not a medical device and should not replace professional medical advice.
            </Text>
        </SafeAreaView>
    );
}
