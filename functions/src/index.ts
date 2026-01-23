import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { generateContent } from "./services/vertexai";

admin.initializeApp();

export const analyzeMealImage = onCall({ region: "us-central1" }, async (request) => {
    // Check authentication
    if (!request.auth) {
        throw new HttpsError(
            "unauthenticated",
            "The function must be called while authenticated."
        );
    }

    const { imageBase64, mimeType, dishName } = request.data;

    if (!imageBase64) {
        throw new HttpsError(
            "invalid-argument",
            "The function must be called with an imageBase64 argument."
        );
    }

    try {
        const result = await generateContent(imageBase64, mimeType, dishName);
        return result;
    } catch (error) {
        console.error("Error calling Gemini:", error);
        throw new HttpsError(
            "internal",
            "Failed to analyze image.",
            error
        );
    }
});
