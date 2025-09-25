
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = 'gemini-2.5-flash';

const systemInstruction = `You are a helpful calculator assistant.
Your task is to evaluate mathematical expressions provided by the user.
Respond with only the final numerical answer.
Do not include any explanations, units, or additional text.
If the user's query is not a mathematical expression, respond with: "I can only perform calculations."`;

export const getAiCalculation = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: model,
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
