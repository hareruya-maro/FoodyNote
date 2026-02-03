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

export type UserProfile = {
    age_group: string; // "10s", "20s", "30s", "40s", "50s", "60s", "70+"
    gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    bowel_type: 'diarrhea' | 'constipation' | 'mixed' | 'gas';
};

export type AnalysisContext = {
    subjective_factors: string[]; // e.g. ["stress", "sleep_deprivation"]
    is_irregular_eating: boolean;
    late_night_meals_count: number;
};

export interface AgenticReport {
    headline: string;
    evidence: string;
    proposal: string;
    doctorComment?: string;
    createdAt?: any;
}
