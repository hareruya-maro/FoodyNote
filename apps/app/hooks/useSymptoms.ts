import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, query, orderBy, getDocs, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { SymptomRecord } from '../types';

export function useSymptoms() {
    const user = auth.currentUser;

    return useQuery({
        queryKey: ['symptoms', user?.uid],
        queryFn: async () => {
            if (!user) return [];
            const q = query(
                collection(db, `users/${user.uid}/symptoms`),
                orderBy('timestamp', 'desc')
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SymptomRecord));
        },
        enabled: !!user,
    });
}

export function useAddSymptom() {
    const queryClient = useQueryClient();
    const user = auth.currentUser;

    return useMutation({
        mutationFn: async (newSymptom: Omit<SymptomRecord, 'id' | 'timestamp'>) => {
            if (!user) throw new Error("Not authenticated");

            await addDoc(collection(db, `users/${user.uid}/symptoms`), {
                ...newSymptom,
                timestamp: new Date().toISOString(),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['symptoms'] });
        },
    });
}
