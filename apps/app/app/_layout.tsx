import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot, useRouter, useSegments } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SessionProvider } from '../ctx';
import { auth } from '../firebaseConfig';
import { getUserProfile } from '../services/userService';
import '../global.css';
import '../i18n';
import { authInitializedAtom, userAtom } from '../store/userAtom';

const queryClient = new QueryClient();

function RootLayoutNav() {
  const [session, setSession] = useAtom(userAtom);
  const [initialized, setInitialized] = useAtom(authInitializedAtom);
  const [profileChecked, setProfileChecked] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  const segments = useSegments();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setSession(user);
      if (user) {
          try {
             const profile = await getUserProfile(user.uid);
             setHasProfile(!!profile);
          } catch (e) {
             console.error("Profile check failed", e);
             setHasProfile(false);
          }
      } else {
          setHasProfile(false);
      }
      setProfileChecked(true);
      setInitialized(true);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!initialized || !isMounted || !profileChecked) return;

    const inAuthGroup = segments[0] === '(auth)';
    const isOnboarding = segments[0] === 'onboarding';

    if (!session && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (session) {
        if (!hasProfile) {
            if (!isOnboarding) {
                router.replace('/onboarding');
            }
        } else if (inAuthGroup || isOnboarding) {
            router.replace('/(app)/(tabs)');
        }
    }
  }, [session, segments, initialized, isMounted, profileChecked, hasProfile]);

  if (!initialized || !profileChecked) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#009688" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <RootLayoutNav />
      </SessionProvider>
    </QueryClientProvider>
  );
}
