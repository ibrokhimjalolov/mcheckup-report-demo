
import { useState, useCallback } from 'react';
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from '@google/genai';
import { SYSTEM_INSTRUCTION } from '../constants';
import type { MedicalReport } from '../types';

// NOTE:
// `process.env` is not available in the browser/Vite runtime.
// Use a Vite-style env var instead, e.g. VITE_API_KEY defined in a `.env` file.
// Example `.env` entry (NOT committed to git):
//   VITE_API_KEY=your_real_api_key_here
//
// Vite exposes env vars on `import.meta.env` when they are prefixed with `VITE_`.
// We read it in a way that won’t crash during build-time or tests.
const API_KEY: string | undefined =
  (typeof import.meta !== 'undefined' &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (import.meta as any).env?.VITE_API_KEY) ||
  undefined;

if (!API_KEY) {
  // Fail fast with a clear message instead of a cryptic runtime error.
  // This will show up in the browser console if the key isn’t configured.
  // You can remove this throw if you prefer silent behavior.
  throw new Error(
    'Missing VITE_API_KEY. Define it in a `.env` file (e.g. VITE_API_KEY=your_key) for useGemini.',
  );
}

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
