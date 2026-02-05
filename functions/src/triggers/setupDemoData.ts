





import * as admin from "firebase-admin";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { demoData } from "../data/demoData";

export const setupDemoData = onCall({ region: "us-central1" }, async (request) => {
    if (!request.auth) {
        throw new HttpsError("unauthenticated", "The function must be called while authenticated.");
    }

    const userId = request.auth.uid;
    const db = admin.firestore();
    const batch = db.batch();
    const userRef = db.collection("users").doc(userId);

    console.log(`Setting up demo data for user: ${userId}`);

    // Add Meals
    demoData.collections.meals.forEach((meal: any) => {
        const ref = userRef.collection("meals").doc(meal.id);
        batch.set(ref, meal.data);
    });

    // Add Symptoms
    demoData.collections.symptoms.forEach((symptom: any) => {
        const ref = userRef.collection("symptoms").doc(symptom.id);
        batch.set(ref, symptom.data);
    });

    try {
        await batch.commit();
        console.log(`Successfully completed demo data setup for user ${userId}`);
        return { success: true };
    } catch (error) {
        console.error("Error writing demo data", error);
        throw new HttpsError("internal", "Failed to setup demo data");
    }
});





