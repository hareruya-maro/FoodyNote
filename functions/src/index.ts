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

    const { imageBase64, mimeType, dishName, language } = request.data;

    if (!imageBase64) {
        throw new HttpsError(
            "invalid-argument",
            "The function must be called with an imageBase64 argument."
        );
    }

    try {
        const result = await generateContent(imageBase64, mimeType, dishName, language);
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
// ... existing code ...
import { generateAgenticReport } from "./services/agenticAnalysis";

export const analyzeWeeklyReport = onCall({ region: "us-central1", timeoutSeconds: 300 }, async (request) => {
    if (!request.auth) {
        throw new HttpsError("unauthenticated", "The function must be called while authenticated.");
    }

    const uid = request.auth.uid;
    const db = admin.firestore();

    // Calculate date range (Last 3 months)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - 3);

    try {
        // Fetch Meals
        const mealsSnapshot = await db.collection("users").doc(uid).collection("meals")
            .where("timestamp", ">=", startDate.toISOString())
            .where("timestamp", "<=", endDate.toISOString())
            .get();

        const meals = mealsSnapshot.docs.map(doc => ({
            dishName: doc.data().dishName || "Unknown",
            ingredients: doc.data().ingredients || [],
            timestamp: doc.data().timestamp
        }));

        // Fetch Symptoms
        const symptomsSnapshot = await db.collection("users").doc(uid).collection("symptoms")
            .where("timestamp", ">=", startDate.toISOString())
            .where("timestamp", "<=", endDate.toISOString())
            .get();

        const symptoms = symptomsSnapshot.docs.map(doc => ({
            type: doc.data().type,
            severity: doc.data().severity,
            timestamp: doc.data().timestamp,
            memo: doc.data().memo
        }));

        if (meals.length === 0 && symptoms.length === 0) {
            return {
                headline: "データ不足",
                evidence: "分析に必要なデータがまだありません。",
                proposal: "まずは食事と体調を記録してみましょう。"
            };
        }

        const report = await generateAgenticReport(meals, symptoms);
        return report;

    } catch (error) {
        console.error("Error in analyzeWeeklyReport:", error);
        throw new HttpsError("internal", "Analysis failed", error);
    }
});
