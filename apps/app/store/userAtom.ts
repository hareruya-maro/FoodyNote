import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { UserSession } from '@/types';

// Custom storage adapter for Expo SecureStore
const secureStorage = createJSONStorage<UserSession>(() => ({
    getItem: async (key) => {
        if (Platform.OS === 'web') {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        }
        const value = await SecureStore.getItemAsync(key);
        return value ? JSON.parse(value) : null;
    },
    setItem: async (key, value) => {
        if (Platform.OS === 'web') {
            localStorage.setItem(key, JSON.stringify(value));
            return;
        }
        await SecureStore.setItemAsync(key, JSON.stringify(value));
    },
    removeItem: async (key) => {
        if (Platform.OS === 'web') {
            localStorage.removeItem(key);
            return;
        }
        await SecureStore.deleteItemAsync(key);
    },
}));

export const userAtom = atomWithStorage<UserSession>('user_session', null, secureStorage);

export const isAuthenticatedAtom = atom((get) => !!get(userAtom));
