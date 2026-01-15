import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { userAtom } from '../store/userAtom';
import '../global.css';

function RootLayoutNav() {
  const session = useAtomValue(userAtom);
  const segments = useSegments();
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Build-in a small delay or just rely on isMounted to ensure RootLayout is ready
    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (session && inAuthGroup) {
      router.replace('/(app)/(tabs)');
    }
  }, [session, segments, isMounted]);

  return <Slot />;
}

import { Suspense } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
  return (
    <Suspense fallback={
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#009688" />
      </View>
    }>
      <RootLayoutNav />
    </Suspense>
  );
}
