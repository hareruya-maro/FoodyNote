import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function AppLayout() {
    const { t } = useTranslation();
    return (
        <Stack screenOptions={{
            headerTintColor: '#009688',
            headerTitleStyle: { fontWeight: 'bold', color: '#1f2937' },
        }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="symptom" options={{ presentation: 'modal', title: 'Record Symptom' }} />
            <Stack.Screen name="meal" options={{ title: 'Meal Entry', headerBackTitle: t('common.back'), }} />
            <Stack.Screen name="doctor" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
        </Stack>
    );
}
