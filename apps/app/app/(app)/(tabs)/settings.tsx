import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Stethoscope, LogOut, ChevronRight, User } from 'lucide-react-native';
import { useSession } from '../../../ctx';

export default function SettingsScreen() {
    const router = useRouter();
    const { signOut } = useSession();

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
            <View className="px-6 py-4 bg-white border-b border-gray-100">
                <Text className="text-2xl font-bold text-gray-800">Settings</Text>
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
                        <Text className="text-white text-lg font-bold">Doctor Presentation Mode</Text>
                        <Text className="text-teal-100 text-sm mt-1">Show checking summary for medical consultation.</Text>
                    </View>
                    <ChevronRight color="white" size={24} />
                </TouchableOpacity>

                <Text className="text-gray-500 font-bold mb-4 uppercase text-xs tracking-wider">Account</Text>

                <View className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
                    <TouchableOpacity className="p-4 border-b border-gray-100 flex-row items-center">
                        <User size={20} color="#4b5563" />
                        <Text className="text-gray-700 ml-3 text-base flex-1">Profile</Text>
                        <ChevronRight size={20} color="#9ca3af" />
                    </TouchableOpacity>
                    <TouchableOpacity className="p-4 flex-row items-center" onPress={signOut}>
                        <LogOut size={20} color="#ef4444" />
                        <Text className="text-red-500 ml-3 text-base flex-1">Sign Out</Text>
                    </TouchableOpacity>
                </View>

                <Text className="text-gray-400 text-center text-xs mt-10">Foody Note v0.1.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}
