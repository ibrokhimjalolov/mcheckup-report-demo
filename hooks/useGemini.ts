
import { useState, useCallback } from 'react';
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from '@google/genai';
import { SYSTEM_INSTRUCTION } from '../constants';
import type { MedicalReport } from '../types';

// FIX: `process.env` is not available in the browser. The original code threw an
// error, preventing the application from loading.
// The Python reference uses `os.environ.get()`, which returns None without
// throwing. This change mimics that behavior, allowing the SDK to potentially
// use Application Default Credentials via the `vertexai: true` flag.
const API_KEY = process.env.API_KEY;

const ai = new GoogleGenAI({ apiKey: API_KEY, vertexai: true });

const cleanJsonString = (text: string): string => {
  const match = text.match(/```json\n([\s\S]*?)\n```/);
  return match ? match[1] : text;
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const useGemini = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = useCallback(async (prompt: string): Promise<MedicalReport> => {
    setIsGenerating(true);

    const maxRetries = 3;
    let lastError: Error = new Error("API call failed after all retries.");

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: {
            role: 'user',
            parts: [{ text: prompt }],
          },
          config: {
            systemInstruction: {
              role: 'model',
              parts: [{ text: SYSTEM_INSTRUCTION }]
            },
            temperature: 0,
            topP: 1,
            responseMimeType: 'application/json',
            safetySettings: [
              { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
              { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
              { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
              { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            ],
            tools: [{ googleSearch: {} }],
          },
        });

        const rawJson = response.text;
        if (!rawJson) {
            throw new Error("API returned an empty or invalid response.");
        }
        const cleanedJson = cleanJsonString(rawJson);
        const parsedReport: MedicalReport = JSON.parse(cleanedJson);
        
        setIsGenerating(false);
        return parsedReport;

      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(`API call attempt ${attempt + 1} of ${maxRetries} failed:`, lastError);

        // Don't retry on the last attempt
        if (attempt + 1 < maxRetries) {
          // FIX: Implement exponential backoff for graceful retries.
          const backoffTime = Math.pow(2, attempt) * 1000;
          console.log(`Retrying in ${backoffTime / 1000} seconds...`);
          await delay(backoffTime);
        }
      }
    }

    setIsGenerating(false);
    // Throw the last captured error after all retries have been exhausted.
    throw lastError;
  }, []);

  return { isGenerating, generateReport };
};
