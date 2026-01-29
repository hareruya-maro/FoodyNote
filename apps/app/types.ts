export type Tag = { id: string; label: string };

export type MealRecord = {
    id: string;
    imageUri?: string;
    timestamp: string; // ISO string
    title: string; // e.g. "Lunch" or inferred dish name
    tags: Tag[]; // Inferred ingredients
    note?: string;
    activeInquiry?: {
        question: string;
        options: {
            label: string;
            tags: Tag[];
        }[];
    };
};

export type SymptomType = 'bloated' | 'pain' | 'nausea' | 'other';
export type SeverityLevel = 'mild' | 'medium' | 'severe';

export type SymptomRecord = {
    id: string;
    type: SymptomType;
    severity: SeverityLevel;
    timestamp: string; // ISO string
    note?: string;
};

export type UserSession = {
    uid: string;
    email: string;
    name?: string;
} | null;
