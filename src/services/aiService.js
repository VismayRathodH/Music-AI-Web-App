
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();

let genAI = null;
if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
} else {
    console.warn("Gemini API Key is missing.");
}

const getModel = async (modelName) => {
    return genAI.getGenerativeModel({ model: modelName });
};

export const generatePlaylist = async (userPrompt, availableSongs) => {
    if (!genAI) {
        throw new Error("AI Service not configured (Missing API Key)");
    }

    try {
        // Prepare the local song list for context (so it can prioritize them or know what's available)
        const localSongsSummary = availableSongs.map(s =>
            `- "${s.title}" by ${s.artist} (Genre: ${s.genre})`
        ).join("\n");

        const prompt = `
        Act as an expert music curator DJ.
        I need a playlist based on the following user request: "${userPrompt}"

        Here is the user's current local library (you MAY use these, but you are NOT restricted to them):
        ${localSongsSummary}

        Task:
        1. Analyze the user's request (mood, genre, context).
        2. Create a playlist of 10-15 songs that perfectly match the vibe. 
        3. prioritize songs from the local library if they fit well, but if they don't, YOU MUST recommend other famous real-world songs.
        4. You MUST return the result in valid JSON format.
        5. The JSON must be an array of objects. Each object must have:
           - "title": The exact song title.
           - "artist": The exact artist name.
           - "reason": A short upbeat reason why it fits.
           - "isLocal": boolean (true if it's from the provided local list, false otherwise).
        6. Do not include ID in the output unless it's a local song, but matching by title/artist is fine.
        7. Do not include any markdown formatting or explanations outside the JSON. Just the raw JSON array.
        `;

        let result;
        try {
            // First attempt with Flash
            const modelFlash = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            result = await modelFlash.generateContent(prompt);
        } catch (flashError) {
            console.warn("Gemini 2.5 Flash failed, retrying with Gemini Pro...", flashError);
            // Fallback to Pro
            const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
            result = await modelPro.generateContent(prompt);
        }

        const response = await result.response;
        const text = response.text();

        // Clean up markdown if Gemini adds it (e.g. ```json ... ```)
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(jsonString);

    } catch (error) {
        console.error("AI Generation failed:", error);
        throw error;
    }
};
