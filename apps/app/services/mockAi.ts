export async function analyzeImage(uri: string): Promise<string[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Return fixed mock tags for now
    // In a real app, we would upload the image to Gemini API here
    return ['Pasta', 'Cheese', 'Bacon', 'Black Pepper', 'Egg', 'Wheat'];
}
