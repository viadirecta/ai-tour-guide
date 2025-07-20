import { GoogleGenAI, Chat, HarmCategory, HarmBlockThreshold } from "@google/genai";

// Ensure the API key is available in the environment variables.
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey });

// Configuration for content generation safety settings
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];


/**
 * Creates and returns a new chat session with the Gemini model.
 * @param {string} systemInstruction The system instruction to configure the AI's persona.
 * @returns {Chat} A chat instance from the @google/genai SDK.
 */
export function createChat(systemInstruction: string): Chat {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    history: [],
    config: {
        safetySettings,
        systemInstruction: systemInstruction || "You are a helpful assistant.", // Fallback instruction
    }
  });
}
