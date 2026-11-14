"use server";

import { adminAction, ActionError } from "./safe-action";
import { searchImages, ImageSearchError, type ImageSearchResult } from "../services/image-search";

/** AI image search for event covers (admin-only) — same search as the admin image picker. */
export const searchEventImages = adminAction(
  async (prompt: string, eventName?: string): Promise<ImageSearchResult> => {
    if (typeof prompt !== "string" || !prompt.trim()) {
      throw new ActionError("VALIDATION", "Describe the image you need");
    }
    try {
      return await searchImages(prompt, eventName);
    } catch (error) {
      if (error instanceof ImageSearchError) throw new ActionError("SERVER_ERROR", error.message);
      throw error;
    }
  }
);
