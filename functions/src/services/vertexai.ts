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
        ? `Analyze this image and identify the dish name and list its ingredients. The user identified this dish as '${dishNameHint}'. Use this as a strong hint. Focus on high-FODMAP ingredients, allergens, and common trigger foods. Respond in ${language}.`
        : `Analyze this image and identify the dish name and list its ingredients. Focus on high-FODMAP ingredients, allergens, and common trigger foods. Respond in ${language}.`;

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
                    }
                },
                required: ["dishName", "ingredients"],
            },
            thinkingConfig: {
                thinkingLevel: ThinkingLevel.LOW,
            }
        }
    });

    const jsonString = response.text;

    if (!jsonString) {
        throw new Error("No response from AI");
    }

    return JSON.parse(jsonString) as { dishName: string, ingredients: string[] };
}
