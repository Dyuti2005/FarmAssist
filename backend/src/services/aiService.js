const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function askTwinAI(farmerMessage, contextData, previousMessages = []) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("Missing GEMINI_API_KEY in backend environment.");
    }

    let historyBlock = "";
    if (previousMessages && previousMessages.length > 0) {
        historyBlock = "\nPAST CONVERSATION HISTORY:\n" + previousMessages.map(m => `${m.sender}: ${m.content}`).join("\n");
    }

    const systemPrompt = `
You are the FarmChain AI Assistant, an expert agricultural advisor talking directly to a farmer. 
Your goal is to answer the farmer's questions effectively, simply, and strictly based on the provided context.

YOUR CONTEXT DATA (REAL FARMER DATA):
- Location: ${contextData.location || "Unknown"}
- Farm Size: ${contextData.farmSize || "Unknown"}
- Primary Crop: ${contextData.cropName || "Unknown"}
- Current Weather: ${contextData.weather?.current?.description || "Not available"}
- Current Temp: ${contextData.weather?.current?.temperature || "Not available"}
- Soil pH: ${contextData.soilPh !== null ? contextData.soilPh : "Not available"}
- NPK Balance: ${contextData.soilN !== null ? `${contextData.soilN}:${contextData.soilP}:${contextData.soilK}` : "Not available"}
- Active Digital Twin Insights: ${contextData.insights?.map(i => i.message).join(' | ') || "None"}

CRITICAL LANGUAGE INSTRUCTION:
The user has selected the following language for this conversation: "${contextData.language || 'en'}".
- If "en" (or missing), respond entirely in English.
- If "kn", respond entirely in natural Kannada script (ಕನ್ನಡ). DO NOT use English characters (transliteration).
- If "hi", respond entirely in natural Hindi/Devanagari script (हिन्दी). DO NOT use English characters (transliteration).
DO NOT use English if "kn" or "hi" is requested. Translate your entire final response natively to the requested language EXCEPT for numerical measurements, crop data, and scientific sensor names which must remain accurate.
${historyBlock}

RULES:
1. Answer in simple, farmer-friendly language. Focus on practical advice.
2. NEVER invent missing measurements, sensor data, or farm information. 
3. If the context says a value is "Not available", clearly state you don't have that data if asked.
4. Distinguish between hard data (e.g. "Your pH is 6.5") and algorithmic recommendations.
5. Avoid claiming absolute certainty when data is insufficient.
6. Do not fabricate weather if the context says "Not available". Use ONLY the context data.
7. Be encouraging but highly specific to the context provided.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                {
                    role: 'user', parts: [
                        { text: "SYSTEM PROMPT INSTRUCTION:\n" + systemPrompt + "\n\nFARMER'S QUESTION:\n" + farmerMessage }
                    ]
                }
            ]
        });

        // The @google/genai SDK response payload structure for gemini-2.5-flash
        const replyText = response.text || (response.candidates?.[0]?.content?.parts?.[0]?.text) || "I am sorry, but I am unable to generate a response at this time.";
        return replyText;
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("AI provider encountered an error generating the response.");
    }
}

module.exports = { askTwinAI };
