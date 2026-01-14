import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { SessionProvider, useSession } from '../ctx';
import '../global.css';

function RootLayoutNav() {
  const { session, isLoading } = useSession();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      // Redirect to the sign-in page.
      router.replace('/(auth)/login');
    } else if (session && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace('/(app)/(tabs)');
    }
  }, [session, segments, isLoading]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <SessionProvider>
      <RootLayoutNav />
    </SessionProvider>
  );
}
