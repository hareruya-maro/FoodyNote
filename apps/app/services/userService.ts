import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { UserProfile } from '../types';

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
            const data = userDoc.data();
            // Check if essential profile fields exist
            if (data.age_group && data.gender && data.bowel_type) {
                return {
                    age_group: data.age_group,
                    gender: data.gender,
                    bowel_type: data.bowel_type
                } as UserProfile;
            }
        }
        return null;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
};

export const saveUserProfile = async (uid: string, profile: UserProfile): Promise<void> => {
    try {
        await setDoc(doc(db, 'users', uid), profile, { merge: true });
    } catch (error) {
        console.error("Error saving user profile:", error);
        throw error;
    }
};
