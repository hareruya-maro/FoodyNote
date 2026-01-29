import { GoogleGenAI } from '@google/genai';

const client = new GoogleGenAI({
    vertexai: true,
    project: process.env.GCLOUD_PROJECT || 'food-note',
    location: 'global'
});

const modelId = 'gemini-3-flash-preview';

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
}

// --- Agent Functions ---

// 1. Analyst Agent: Finds patterns in raw data
async function runAnalystAgent(meals: MealLog[], symptoms: SymptomLog[]): Promise<Correlation[]> {
    const prompt = `
    You are an expert Medical Data Analyst. Analyze the following meal and symptom logs to find correlations.
    
    Data:
    Meals: ${JSON.stringify(meals)}
    Symptoms: ${JSON.stringify(symptoms)}

    Task:
    Identify potential "Trigger Foods" that might be causing symptoms.
    Focus on time lags (e.g., symptoms appearing 1-24 hours after eating).
    Look for repeated patterns.
    
    Return a list of top 3 most likely correlations.
    `;

    const response = await client.models.generateContent({
        model: modelId,
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

    const results: ResearchResult[] = [];

    for (const corr of correlations) {
        const prompt = `
        You are a Medical Researcher. Investigate if there is a known link between '${corr.triggerCandidate}' and '${corr.symptomType}'.
        Use Google Search to find scientific mechanisms (e.g., FODMAPs, allergies, digestion speed).
        
        Context from Analyst: ${corr.observation}
        `;

        const response = await client.models.generateContent({
            model: modelId,
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
            results.push(JSON.parse(response.text) as ResearchResult);
        }
    }

    return results;
}

// 3. Writer Agent: Generates the final user-facing report
async function runWriterAgent(correlations: Correlation[], research: ResearchResult[]): Promise<AgenticReport> {
    const prompt = `
    You are a friendly and empathetic Health Advisor. Write a weekly report for the user based on the analysis and research.
    
    Analyst Findings: ${JSON.stringify(correlations)}
    Researcher Findings: ${JSON.stringify(research)}

    Task:
    Write a concise report with 3 sections:
    1. Headline: A catchy summary (e.g., "Suspicion of Wheat Sensitivity").
    2. Evidence: Explain why we think this (based on data and research).
    3. Proposal: Actionable advice for next week (e.g., "Try gluten-free for 3 days").

    Tone: Professional but approachable. Avoid sounding like a definitive medical diagnosis. Use "might", "possible", "suggest".
    Output Language: Japanese.
    `;

    const response = await client.models.generateContent({
        model: modelId,
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
    return JSON.parse(response.text) as AgenticReport;
}

// Orchestrator
export async function generateAgenticReport(meals: any[], symptoms: any[]): Promise<AgenticReport> {
    // 0. Pre-process logs (dates are strings or timestamps, ensure consistency)
    // Assuming incoming data is already simple objects

    // 1. Analyst
    const correlations = await runAnalystAgent(meals, symptoms);

    // 2. Researcher
    // Filter to only high confidence or top results
    const topCorrelations = correlations.filter(c => c.confidenceScore >= 5).slice(0, 3);
    const researchResults = await runResearcherAgent(topCorrelations);

    // 3. Writer
    const report = await runWriterAgent(topCorrelations, researchResults);

    return report;
}
