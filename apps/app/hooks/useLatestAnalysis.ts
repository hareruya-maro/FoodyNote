import { useQuery } from '@tanstack/react-query';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { AgenticReport } from '../types';

export function useLatestAnalysis() {
    const user = auth.currentUser;

    return useQuery({
        queryKey: ['latestAnalysis', user?.uid],
        queryFn: async () => {
            if (!user) return null;
            const q = query(
                collection(db, `users/${user.uid}/analysis_reports`),
                orderBy('createdAt', 'desc'),
                limit(1)
            );
            const snapshot = await getDocs(q);
            if (snapshot.empty) return null;
            return snapshot.docs[0].data() as AgenticReport;
        },
        enabled: !!user,
    });
}
