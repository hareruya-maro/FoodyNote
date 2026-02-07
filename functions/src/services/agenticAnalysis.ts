import { GoogleGenAI } from '@google/genai';

const client = new GoogleGenAI({
    vertexai: true,
    project: process.env.GCLOUD_PROJECT || 'food-note',
    location: 'global'
});

const modelIdFlash = 'gemini-3-flash-latest';
const modelIdPro = 'gemini-3-pro-preview';

// --- Data Models ---

interface MealLog {
    dishName: string;
    ingredients: { id: string, label: string }[];
    timestamp: string;
}

interface SymptomLog {
    type: string;
    severity: number;
    timestamp: string;
    memo?: string;
}

export interface UserProfile {
    age_group: string;
    gender: string;
    bowel_type: 'diarrhea' | 'constipation' | 'mixed' | 'gas';
}

export interface AnalysisContext {
    subjective_factors: string[];
    is_irregular_eating: boolean;
    late_night_meals_count: number;
}

interface Correlation {
    triggerCandidate: string;
    symptomType: string;
    timeLagHours: number;
    confidenceScore: number; // 1-10
    observation: string; // e.g., "Occurred 3 times after eating X"
}

interface ResearchResult {
    triggerCandidate: string;
    mechanism: string;
    scientificBacking: string; // "Strong", "Weak", "None"
    searchSummary: string;
}

export interface AgenticReport {
    headline: string;
    evidence: string;
    proposal: string;
    doctorComment: string;
}

// --- Agent Functions ---

// 1. Analyst Agent: Finds patterns in raw data
async function runAnalystAgent(meals: MealLog[], symptoms: SymptomLog[], userProfile?: UserProfile, context?: AnalysisContext): Promise<Correlation[]> {
    const prompt = `
    You are an expert Medical Data Analyst. Analyze the following meal and symptom logs to find correlations.
    
    User Profile:
    ${userProfile ? JSON.stringify(userProfile) : "Unknown"}

    Context (Lifestyle/Environment):
    ${context ? JSON.stringify(context) : "None"}

    Data:
    Meals: ${JSON.stringify(meals)}
    Symptoms: ${JSON.stringify(symptoms)}

    Task:
    Identify potential "Trigger Foods" that might be causing symptoms.
    Consider the user's bowel type and context (e.g. stress, sleep) when analyzing.
    Focus on time lags (e.g., symptoms appearing 1-24 hours after eating).
    Look for repeated patterns.
    
    Return a list of top 3 most likely correlations.
    IMPORTANT: 'confidenceScore' must be a number between 1 (lowest) and 10 (highest). Do not return 0-1 decimals.
    `;

    const response = await client.models.generateContent({
        model: modelIdPro,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: 'ARRAY',
                items: {
                    type: 'OBJECT',
                    properties: {
                        triggerCandidate: { type: 'STRING' },
                        symptomType: { type: 'STRING' },
                        timeLagHours: { type: 'NUMBER' },
                        confidenceScore: { type: 'NUMBER' },
                        observation: { type: 'STRING' },
                    },
                    required: ["triggerCandidate", "symptomType", "timeLagHours", "confidenceScore", "observation"]
                }
            }
        }
    });

    if (!response.text) return [];
    return JSON.parse(response.text) as Correlation[];
}

// 2. Researcher Agent: Verifies with Google Search
async function runResearcherAgent(correlations: Correlation[]): Promise<ResearchResult[]> {
    if (correlations.length === 0) return [];

    const promises = correlations.map(async (corr) => {
        const prompt = `
        You are a Medical Researcher. Investigate if there is a known link between '${corr.triggerCandidate}' and '${corr.symptomType}'.
        Use Google Search to find scientific mechanisms (e.g., FODMAPs, allergies, digestion speed).
        
        Context from Analyst: ${corr.observation}
        `;

        const response = await client.models.generateContent({
            model: modelIdPro,
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            // @ts-ignore: tools is supported but types might be outdated
            tools: [{ googleSearch: {} }],
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: 'OBJECT',
                    properties: {
                        triggerCandidate: { type: 'STRING' },
                        mechanism: { type: 'STRING' },
                        scientificBacking: { type: 'STRING', enum: ["Strong", "Moderate", "Weak", "None"] },
                        searchSummary: { type: 'STRING' },
                    },
                    required: ["triggerCandidate", "mechanism", "scientificBacking", "searchSummary"]
                }
            }
        });

        if (response.text) {
            return JSON.parse(response.text) as ResearchResult;
        }
        return null;
    });

    const results = await Promise.all(promises);
    return results.filter((r): r is ResearchResult => r !== null);
}

// 3. Writer Agent: Generates the final user-facing report
async function runWriterAgent(correlations: Correlation[], research: ResearchResult[], language: string = 'Japanese', userProfile?: UserProfile, context?: AnalysisContext): Promise<Omit<AgenticReport, 'doctorComment'>> {
    const prompt = `
    You are a friendly and empathetic Health Advisor. Write a weekly report for the user based on the analysis and research.
    
    User Profile:
    ${userProfile ? JSON.stringify(userProfile) : "Unknown"}

    Context:
    ${context ? JSON.stringify(context) : "None"}

    Analyst Findings: ${JSON.stringify(correlations)}
    Researcher Findings: ${JSON.stringify(research)}

    Task:
    Write a concise report with 3 sections:
    1. Headline: A catchy summary (e.g., "Suspicion of Wheat Sensitivity").
    2. Evidence: Explain why we think this (based on data, research, and user context).
    3. Proposal: Actionable advice for next week (e.g., "Try gluten-free for 3 days").

    Tone: Professional but approachable. Avoid sounding like a definitive medical diagnosis. Use "might", "possible", "suggest".
    Personalize the advice based on their age, gender, and bowel type if applicable.
    Output Language: ${language}.
    `;

    const response = await client.models.generateContent({
        model: modelIdFlash,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: 'OBJECT',
                properties: {
                    headline: { type: 'STRING' },
                    evidence: { type: 'STRING' },
                    proposal: { type: 'STRING' },
                },
                required: ["headline", "evidence", "proposal"]
            }
        }
    });

    if (!response.text) throw new Error("Writer agent failed");
    return JSON.parse(response.text) as Omit<AgenticReport, 'doctorComment'>;
}

// 4. Doctor Agent: Generates a professional summary for medical practitioners
async function runDoctorAgent(correlations: Correlation[], research: ResearchResult[], language: string = 'Japanese', userProfile?: UserProfile, context?: AnalysisContext): Promise<string> {
    const prompt = `
    You are a Medical AI Assistant designed to support Gastroenterologists.
    Summarize the analysis results for a doctor to review.

    User Profile:
    ${userProfile ? JSON.stringify(userProfile) : "Unknown"}

    Context:
    ${context ? JSON.stringify(context) : "None"}

    Analyst Findings (Correlations): ${JSON.stringify(correlations)}
    Researcher Findings (Mechanisms): ${JSON.stringify(research)}

    Task:
    Write a "Medical Summary" for the doctor.
    - Use professional medical terminology (e.g., mention FODMAPs, specific enzymes, motility issues, IgE/IgG mechanisms if relevant).
    - Be objective and concise.
    - Highlight potential areas for clinical investigation (e.g., "Consider breath test for SIBO if bloating persists").
    - Format as a single paragraph or bullet points.
    - Output Language: ${language} (Professional Medical terminology).
    `;

    const response = await client.models.generateContent({
        model: modelIdPro,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: 'OBJECT',
                properties: {
                    doctorComment: { type: 'STRING' }
                },
                required: ["doctorComment"]
            }
        }
    });

    if (!response.text) return "分析データなし";
    const result = JSON.parse(response.text);
    return result.doctorComment;
}

// Orchestrator
export async function generateAgenticReport(
    meals: any[],
    symptoms: any[],
    language: string = 'Japanese',
    userProfile?: UserProfile,
    context?: AnalysisContext
): Promise<AgenticReport> {
    // 0. Pre-process logs (dates are strings or timestamps, ensure consistency)
    // Assuming incoming data is already simple objects

    // 1. Analyst
    const correlations = await runAnalystAgent(meals, symptoms, userProfile, context);

    // 2. Researcher
    // Filter to only high confidence or top results
    const topCorrelations = correlations.filter(c => c.confidenceScore >= 5).slice(0, 3);
    const researchResults = await runResearcherAgent(topCorrelations);

    // 3. Writer & 4. Doctor Agent (Parallel Execution)
    const [writerReport, doctorComment] = await Promise.all([
        runWriterAgent(topCorrelations, researchResults, language, userProfile, context),
        runDoctorAgent(topCorrelations, researchResults, language, userProfile, context)
    ]);

    return {
        ...writerReport,
        doctorComment
    };
}