
import { GoogleGenAI } from "@google/genai";

// Fix: Use `process.env.API_KEY` as per the coding guidelines. This resolves the TypeScript error with `import.meta.env`.
if (!process.env.API_KEY) {
  // This error will be caught during the app's initialization
  // Fix: Updated error message to be more generic and not reference Vite-specific configuration.
  throw new Error("Configuration Error: The API_KEY environment variable is not set. Please ensure it is configured in your deployment environment.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const systemInstruction = `You are a helpful calculator assistant.
Your task is to evaluate mathematical expressions provided by the user.
Respond with only the final numerical answer.
Do not include any explanations, units, or additional text.
If the user's query is not a mathematical expression, respond with: "I can only perform calculations."`;

export const getAiCalculation = async (prompt: string): Promise<string> => {
  try {
    // Fix: Pass model name directly as per coding guidelines, instead of defining it in a separate variable.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0,
      },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Sorry, something went wrong. Please try again.";
  }
};
