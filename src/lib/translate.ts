import { translateTexts as translateOnServer } from "@/lib/actions/translate";
import { unwrap } from "@/lib/actions/action-result";

export type Lang = "es" | "en";

/** Translate texts between Spanish and English (server-side, works in any browser). */
export function translateTexts(texts: string[], from: Lang): Promise<string[]> {
  return unwrap(translateOnServer(texts, from));
}
