import { atom } from 'jotai';
import { User } from 'firebase/auth';
import { UserProfile } from '../types';

// We store the Firebase User object (or a simplified version)
export const userAtom = atom<User | null>(null);
export const authInitializedAtom = atom<boolean>(false);
export const userProfileAtom = atom<UserProfile | null>(null);
