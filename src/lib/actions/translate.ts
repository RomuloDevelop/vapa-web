"use server";

import { adminAction, ActionError } from "./safe-action";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

/**
 * Translate an array of Spanish texts to English using Gemini (admin-only).
 */
export const translateTexts = adminAction(
  async (texts: string[]): Promise<{ translations: string[] }> => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new ActionError("SERVER_ERROR", "Gemini API key not configured");
    }

    if (!texts || texts.length === 0) {
      throw new ActionError("VALIDATION", "texts array is required");
    }

    // Filter out empty strings, keep track of indices
    const nonEmptyEntries = texts
      .map((text, index) => ({ text, index }))
      .filter((entry) => entry.text.trim().length > 0);

    if (nonEmptyEntries.length === 0) {
      return { translations: texts.map(() => "") };
    }

    const numberedTexts = nonEmptyEntries
      .map((entry, i) => `${i + 1}. ${entry.text}`)
      .join("\n");

    const prompt = `Translate the following Spanish texts to English. Return ONLY the translations as a JSON array of strings, in the same order. Do not include numbering, explanations, or markdown formatting — just the raw JSON array.

${numberedTexts}`;

    const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      throw new ActionError("SERVER_ERROR", `Translation API error: ${response.status}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      console.error("Gemini returned no content:", JSON.stringify(data));
      throw new ActionError("SERVER_ERROR", "Translation returned empty response");
    }

    let translations: string[];
    try {
      translations = JSON.parse(rawText);
    } catch {
      console.error("Failed to parse Gemini response:", rawText);
      throw new ActionError("SERVER_ERROR", "Failed to parse translation response");
    }

    if (translations.length !== nonEmptyEntries.length) {
      throw new ActionError("SERVER_ERROR", "Translation count mismatch");
    }

    // Map translations back to original positions
    const result = texts.map(() => "");
    nonEmptyEntries.forEach((entry, i) => {
      result[entry.index] = translations[i];
    });

    return { translations: result };
  }
);
