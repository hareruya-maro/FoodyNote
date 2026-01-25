import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, query, orderBy, where, getDocs, addDoc, Timestamp, doc, updateDoc, deleteField } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage, } from '../firebaseConfig';
import { MealRecord } from '../types';

export function useMeals() {
    const user = auth.currentUser;

    return useQuery({
        queryKey: ['meals', user?.uid],
        queryFn: async () => {
            if (!user) return [];
            const q = query(
                collection(db, `users/${user.uid}/meals`),
                orderBy('timestamp', 'desc')
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MealRecord));
        },
        enabled: !!user,
    });
}

export function useAddMeal() {
    const queryClient = useQueryClient();
    const user = auth.currentUser;

    return useMutation({
        mutationFn: async (newMeal: { title: string; imageUri: string; tags: string[]; activeInquiry?: MealRecord['activeInquiry']; timestamp?: string }) => {
            if (!user) throw new Error("Not authenticated");

            // 1. Upload Image
            const response = await fetch(newMeal.imageUri);
            const blob = await response.blob();
            const filename = `${Date.now()}.jpg`;
            const storageRef = ref(storage, `users/${user.uid}/meals/${filename}`);
            await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(storageRef);

            // 2. Add to Firestore
            const docRef = await addDoc(collection(db, `users/${user.uid}/meals`), {
                title: newMeal.title,
                tags: newMeal.tags,
                activeInquiry: newMeal.activeInquiry || null,
                imageUri: downloadURL,
                timestamp: newMeal.timestamp || new Date().toISOString(),
            });

            return docRef.id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['meals'] });
        },
    });
}

export function useUpdateMeal() {
    const queryClient = useQueryClient();
    const user = auth.currentUser;

    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<MealRecord> | { activeInquiry: any } }) => {
            if (!user) throw new Error("Not authenticated");
            const docRef = doc(db, `users/${user.uid}/meals`, id);
            await updateDoc(docRef, updates);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['meals'] });
        },
    });
}
