export default {
    common: {
        language: "Language",
        settings: "Settings",
        japanese: "Japanese",
        english: "English",
        back: "Back",
        error: "Error",
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
        insight: "Your data suggests that \"{{name}}\" appears frequently before your symptoms. It was found in {{count}} meals prior to episodes.",
        detectiveTitle: "AI Weekly Detective",
        agentStatus: {
            analyst: "Analyst Agent is scanning your logs...",
            researcher: "Researcher Agent is checking Google Search...",
            writer: "Writer Agent is drafting your report...",
        },
        analysisFailed: "Analysis Failed",
        evidence: "EVIDENCE",
        proposal: "PROPOSAL",
        refresh: "Refresh",
        discoverPatterns: "Discover Hidden Patterns",
        discoverDescription: "Let our AI Agents (Analyst, Researcher, and Writer) investigate your logs from the last 3 months.",
        startInvestigation: "Start Investigation",
        history: "Analysis History",
        noHistory: "No analysis history yet",
        historyHint: "Run an analysis to see reports here",
        historyFetchFailed: "Failed to fetch history",
    },
    doctor: {
        reportTitle: "Foody Note Report",
        reviewSummary: "Review Summary",
        stats: {
            symptoms: "Recorded Symptoms",
            totalRecorded: "Total Recorded",
            avgLag: "Avg Lag Time",
            eatingToSymptom: "Eating to Symptom"
        },
        correlatedIngredients: "Correlated Ingredients (Analysis View)",
        referAnalysis: "Please refer to the \"Analysis\" tab for the detailed trigger ranking algorithm results.",
        recentEpisodes: "Recent Episodes",
        noEpisodes: "No episodes recorded.",
        condition: "Condition: {{type}} ({{severity}})"
    },
    meal: {
        takePhoto: "Take a photo of your meal",
        tapToSnap: "Tap to Snap",
        selectFromLibrary: "Select from Library",
        dishNameLabel: "Dish Name",
        dishNamePlaceholder: "Enter dish name (Optional)",
        detectedIngredients: "Detected Ingredients",
        detectedCount: "Detected {{count}} ingredients",
        add: "Add",
        analyzeHint: "Tap \"Analyze Meal\" to detect ingredients.",
        analyzeBtn: "Analyze Meal",
        saveBtn: "Save Record",
        analysisFailedTitle: "Analysis Failed",
        analysisFailedMsg: "Could not analyze the image. Please try again.",
        errorTitle: "Error"
    },
    symptom: {
        question: "How are you feeling?",
        severityLabel: "Severity",
        notesLabel: "Notes",
        notesPlaceholder: "Describe your symptoms (e.g. sharp pain after eating)",
        saveBtn: "Save Symptom"
    },
    login: {
        subtitle: "Discover the hidden causes of your upset stomach with just a photo.",
        startBtn: "Agree & Start",
        disclaimer: "By continuing, you agree that this app is not a medical device and should not replace professional medical advice."
    },
    profile: {
        title: "Profile Settings",
        age: "Age",
        gender: "Gender",
        bowelType: "Bowel Type",
        save: "Save",
        options: {
            gender: {
                male: "Male",
                female: "Female",
                other: "Other",
                prefer_not_to_say: "Prefer not to say"
            },
            bowel: {
                diarrhea: "Diarrhea-prone",
                constipation: "Constipation-prone",
                mixed: "Mixed (Alternating)",
                gas: "Gas / Bloating"
            }
        },
        setupTitle: "Profile Setup",
        setupDescription: "To improve analysis accuracy, please tell us a bit about yourself."
    },
    context: {
        modalTitle: "Weekly Lifestyle Condition",
        modalDescription: "This helps the analysis. Please select all that apply.",
        factors: {
            stress: "😫 High Stress",
            sleep: "🛌 Lack of Sleep",
            fast_eating: "💨 Ate too fast",
            party: "🍺 Dining out / Drinking",
            medication: "💊 Taking Medication"
        },
        analyzeBtn: "Analyze with these conditions"
    }
};
