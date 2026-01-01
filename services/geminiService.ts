
import { GoogleGenAI, Type } from "@google/genai";
import { SkinAnalysisResult } from "../types";

export const analyzeSkin = async (imageBase64: string): Promise<SkinAnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `You are a professional AI Dermatologist. Analyze the provided high-resolution image of human skin.
  
  Identify:
  1. Primary Skin Type (Oily, Dry, Combination, Normal, Sensitive).
  2. Specific dermatological observations (e.g., localized erythema, inflammatory papules, hyperpigmentation, fine lines).
  3. Metrics (0-100 scale):
     - Hydration Bio-Factor
     - Sensitivity Index
     - Overall Health Score (General vitality and barrier function)
     - Biological Age Index (Estimate based on elasticity and texture)

  Provide:
  - A professional clinical summary of the observations.
  - A list of concerns (concise tags like "REDNESS", "UNEVEN TEXTURE").
  - A comprehensive AM and PM routine with specific steps.
  - 3-5 specific clinical product recommendations.
  
  Ensure the tone is clinical and precise.
  Always include a medical disclaimer.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: imageBase64,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            skinType: { type: Type.STRING },
            description: { type: Type.STRING },
            concerns: { type: Type.ARRAY, items: { type: Type.STRING } },
            hydrationLevel: { type: Type.NUMBER },
            sensitivityScore: { type: Type.NUMBER },
            healthScore: { type: Type.NUMBER },
            ageIndex: { type: Type.NUMBER },
            recommendations: {
              type: Type.OBJECT,
              properties: {
                ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                routine: {
                  type: Type.OBJECT,
                  properties: {
                    morning: { type: Type.ARRAY, items: { type: Type.STRING } },
                    evening: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ['morning', 'evening']
                },
                lifestyle: { type: Type.ARRAY, items: { type: Type.STRING } },
                products: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      category: { type: Type.STRING },
                      reason: { type: Type.STRING },
                      priceRange: { type: Type.STRING },
                      link: { type: Type.STRING }
                    },
                    required: ['name', 'category', 'reason', 'priceRange', 'link']
                  }
                }
              },
              required: ['ingredients', 'routine', 'lifestyle', 'products']
            },
            disclaimer: { type: Type.STRING },
          },
          required: ['skinType', 'description', 'concerns', 'hydrationLevel', 'sensitivityScore', 'healthScore', 'ageIndex', 'recommendations', 'disclaimer']
        },
      },
    });

    const resultStr = response.text;
    if (!resultStr) throw new Error("EMPTY_RESPONSE");

    const parsed = JSON.parse(resultStr) as SkinAnalysisResult;
    return parsed;
  } catch (error: any) {
    console.error("Analysis Error:", error);
    throw new Error(error.message || "Diagnostic failure. System interrupted.");
  }
};
