export default {
    common: {
        language: "Language",
        settings: "Settings",
        japanese: "Japanese",
        english: "English",
    },
    settings: {
        title: "Settings",
        doctorMode: {
            title: "Doctor Presentation Mode",
            description: "Show checking summary for medical consultation."
        },
        preferences: "Preferences",
        account: "Account",
        profile: "Profile",
        signOut: "Sign Out",
    },
    tabs: {
        home: "Home",
        calendar: "Calendar",
        analysis: "Analysis",
        settings: "Settings"
    },
    home: {
        noRecords: "No records yet.",
        addFirst: "Add your first meal or symptom!",
        buttons: {
            symptom: "Symptom",
            meal: "Meal"
        }
    },
    symptoms: {
        types: {
            pain: "Pain",
            bloated: "Bloated",
            nausea: "Nausea"
        },
        severities: {
            mild: "Mild",
            moderate: "Moderate",
            severe: "Severe"
        }
    },
    calendar: {
        history: "History",
        mock: {
            title: "Calendar View Mock",
            description: "Days with symptoms highlighted in Red",
            lunch: "Lunch",
            meal: "Pasta (Carbonara)",
            symptom: "Symptom",
            symptomDetail: "Stomach Pain (Medium)"
        }
    },
    analysis: {
        title: "Analysis",
        triggerFound: "Potential Trigger Found",
        noData: {
            title: "Not enough data yet.",
            description: "Keep recording meals and symptoms to find patterns."
        },
        topCandidates: "Top Trigger Candidates",
        associatedEpisodes: "Associated with {{count}} episodes",
        freq: "freq.",
        noPatterns: "No patterns detected yet.",
        insight: "Your data suggests that \"{{name}}\" appears frequently before your symptoms. It was found in {{count}} meals prior to episodes."
    }
};
