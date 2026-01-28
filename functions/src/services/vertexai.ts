import { GoogleGenAI, ThinkingLevel } from '@google/genai';

// Initialize Gen AI Client with Vertex AI backend
const client = new GoogleGenAI({
    vertexai: true,
    project: process.env.GCLOUD_PROJECT || 'food-note', // Fallback to project ID if env not set
    location: 'global'
});

const model = 'gemini-3-flash-preview';

export async function generateContent(imageBase64: string, mimeType: string = 'image/jpeg', dishNameHint?: string, language: string = 'en') {
    const promptText = dishNameHint
        ? `Analyze this image and identify the dish name and list its ingredients. The user identified this dish as '${dishNameHint}'. Use this as a strong hint. Focus on high-FODMAP ingredients, allergens, and common trigger foods. If you are unsure about hidden ingredients (e.g. wheat in curry roux, milk in latte), generate a multiple-choice question in 'activeInquiry'. Respond in ${language}.`
        : `Analyze this image and identify the dish name and list its ingredients. Focus on high-FODMAP ingredients, allergens, and common trigger foods. If you are unsure about hidden ingredients (e.g. wheat in curry roux, milk in latte), generate a multiple-choice question in 'activeInquiry'. Respond in ${language}.`;

    const response = await client.models.generateContent({
        model: model,
        contents: [{
            role: 'user',
            parts: [
                {
                    inlineData: {
                        mimeType: mimeType,
                        data: imageBase64
                    }
                },
                { text: promptText }
            ]
        }],
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: 'OBJECT',
                properties: {
                    dishName: { type: 'STRING', description: "The name of the dish." },
                    ingredients: {
                        type: 'ARRAY',
                        items: { type: 'STRING' },
                        description: "List of ingredients, allergens, and key components."
                    },
                    activeInquiry: {
                        type: 'OBJECT',
                        description: "A question to ask the user if critical information is missing (e.g., 'Is this store-bought roux?').",
                        properties: {
                            question: { type: 'STRING', description: "The question text." },
                            options: {
                                type: 'ARRAY',
                                items: {
                                    type: 'OBJECT',
                                    properties: {
                                        label: { type: 'STRING', description: "Display text for the option (e.g., 'Yes (Wheat)')." },
                                        tags: { type: 'ARRAY', items: { type: 'STRING' }, description: "Tags to add if this option is selected." }
                                    },
                                    required: ["label", "tags"]
                                }
                            }
                        },
                        required: ["question", "options"]
                    }
                },
                required: ["dishName", "ingredients"],
            },
            thinkingConfig: {
                thinkingLevel: ThinkingLevel.LOW,
            },
            tools: [{ codeExecution: {} }],
        }
    });

    const jsonString = response.text;

    if (!jsonString) {
        throw new Error("No response from AI");
    }

    return JSON.parse(jsonString) as { dishName: string, ingredients: string[], activeInquiry?: { question: string, options: { label: string, tags: string[] }[] } };
}
