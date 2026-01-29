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
        ? `Analyze this image and identify the dish name and list its ingredients. The user identified this dish as '${dishNameHint}'. Use this as a strong hint.
        
        Focus on high-FODMAP ingredients, allergens, and common trigger foods.
        When identifying ingredients/tags, prioritize using the following known categories and IDs if applicable:
        
        Categories:
        - Grains/Carbs: wheat_bread (Bread), wheat_noodle (Noodles), rice_white (White Rice), rice_brown (Brown Rice), etc.
        - Dairy/Eggs: milk_cow (Cow Milk), yogurt (Yogurt), cheese_hard (Hard Cheese), egg_whole (Whole Egg), etc.
        - Legumes: soy_bean_whole (Whole Soybeans), tofu (Tofu), natto (Natto), etc.
        - Meat/Fish: beef_fatty (Fatty Beef), chicken_breast (Chicken Breast), fish_blue (Blue-backed Fish), etc.
        - Vegetables: onion (Onion), garlic (Garlic), mushroom (Mushroom), tomato (Tomato), etc.
        - Fruits: apple_pear (Apple/Pear), banana_ripe (Ripe Banana), etc.
        - Condiments: oil_fried (Frying Oil), spices_hot (Chili Peppers), caffeine_coffee (Coffee), etc.
        
        If a specific ID fits, use it. If not, generate a new ID (snake_case) and a user-friendly label.
        
        If you are unsure about hidden ingredients (e.g. wheat in curry roux, milk in latte), generate a multiple-choice question in 'activeInquiry'. Respond in ${language}.`
        : `Analyze this image and identify the dish name and list its ingredients. Focus on high-FODMAP ingredients, allergens, and common trigger foods.
        
        When identifying ingredients/tags, prioritize using the following known categories and IDs if applicable:
        - Grains/Carbs: wheat_bread (Bread), wheat_noodle (Noodles), rice_white (White Rice), rice_brown (Brown Rice), etc.
        - Dairy/Eggs: milk_cow (Cow Milk), yogurt (Yogurt), cheese_hard (Hard Cheese), egg_whole (Whole Egg), etc.
        - Legumes: soy_bean_whole (Whole Soybeans), tofu (Tofu), natto (Natto), etc.
        - Meat/Fish: beef_fatty (Fatty Beef), chicken_breast (Chicken Breast), fish_blue (Blue-backed Fish), etc.
        - Vegetables: onion (Onion), garlic (Garlic), mushroom (Mushroom), tomato (Tomato), etc.
        - Fruits: apple_pear (Apple/Pear), banana_ripe (Ripe Banana), etc.
        - Condiments: oil_fried (Frying Oil), spices_hot (Chili Peppers), caffeine_coffee (Coffee), etc.

        If a specific ID fits, use it. If not, generate a new ID (snake_case) and a user-friendly label.
        If you are unsure about hidden ingredients (e.g. wheat in curry roux, milk in latte), generate a multiple-choice question in 'activeInquiry'. Respond in ${language}.`;

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
                        items: {
                            type: 'OBJECT',
                            properties: {
                                id: { type: 'STRING', description: "Stable ID for analysis (e.g. 'wheat_bread')." },
                                label: { type: 'STRING', description: "Display name (e.g. 'パン類（小麦）')." }
                            },
                            required: ["id", "label"]
                        },
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
                                        tags: {
                                            type: 'ARRAY',
                                            items: {
                                                type: 'OBJECT',
                                                properties: {
                                                    id: { type: 'STRING' },
                                                    label: { type: 'STRING' }
                                                },
                                                required: ["id", "label"]
                                            },
                                            description: "Tags to add if this option is selected."
                                        }
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

    return JSON.parse(jsonString) as { dishName: string, ingredients: { id: string, label: string }[], activeInquiry?: { question: string, options: { label: string, tags: { id: string, label: string }[] }[] } };
}
