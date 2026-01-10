
import { GoogleGenAI, Type } from "@google/genai";
import { Track, AIAnalysis } from "../types";

// Fix: Initialize with the correct named parameter and use process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeTrack = async (track: Track): Promise<AIAnalysis> => {
  try {
    const prompt = `Analyze this track: "${track.title}" by ${track.artist} (${track.genre}). 
    Provide a mood analysis, a short poetic description, a 3-color palette for a visualizer, and a prompt for a generative art system.`;

    // Fix: Call generateContent directly on ai.models with correct parameters
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mood: { type: Type.STRING },
            description: { type: Type.STRING },
            colorPalette: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            visualPrompt: { type: Type.STRING }
          },
          // Using propertyOrdering as per recommended SDK pattern for schema definitions
          propertyOrdering: ["mood", "description", "colorPalette", "visualPrompt"]
        }
      }
    });

    // Fix: Access text property directly (it's a property, not a method) and trim before parsing
    const data = JSON.parse(response.text.trim());
    return data as AIAnalysis;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      mood: "Atmospheric",
      description: "A mysterious blend of sound and space.",
      colorPalette: ["#3b82f6", "#8b5cf6", "#ec4899"],
      visualPrompt: "Abstract neon waves in deep space"
    };
  }
};
