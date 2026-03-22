/**
 * One-time script to backfill English translations for existing events and presentations.
 *
 * Reads all records where _en columns are NULL, sends them to Gemini in batches,
 * and updates the DB with the translations.
 *
 * Usage:
 *   bun run --env-file=.env.development.local scripts/backfill-translations.ts
 *
 * Required env vars:
 *   SUPABASE_URL, SUPABASE_SECRET_KEY, GEMINI_API_KEY
 */

import { createClient } from "@supabase/supabase-js";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const BATCH_SIZE = 10; // Records per batch (translates 2 texts per record)
const DELAY_MS = 4500; // Gemini free tier: 15 RPM → ~4s between requests

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SECRET_KEY!;
const geminiKey = process.env.GEMINI_API_KEY!;

if (!supabaseUrl || !supabaseKey || !geminiKey) {
  console.error("Missing required env vars: SUPABASE_URL, SUPABASE_SECRET_KEY, GEMINI_API_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function translateTexts(texts: string[]): Promise<string[]> {
  const nonEmpty = texts
    .map((text, index) => ({ text, index }))
    .filter((e) => e.text && e.text.trim().length > 0);

  if (nonEmpty.length === 0) return texts.map(() => "");

  const numberedTexts = nonEmpty
    .map((entry, i) => `${i + 1}. ${entry.text}`)
    .join("\n");

  const prompt = `Translate the following Spanish texts to English. Return ONLY the translations as a JSON array of strings, in the same order. Do not include numbering, explanations, or markdown formatting — just the raw JSON array.

${numberedTexts}`;

  const response = await fetch(`${GEMINI_URL}?key=${geminiKey}`, {
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
    throw new Error(`Gemini API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error("Gemini returned no content");
  }

  const translations: string[] = JSON.parse(rawText);

  if (translations.length !== nonEmpty.length) {
    throw new Error(
      `Translation count mismatch: expected ${nonEmpty.length}, got ${translations.length}`
    );
  }

  const result = texts.map(() => "");
  nonEmpty.forEach((entry, i) => {
    result[entry.index] = translations[i];
  });
  return result;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function backfillEvents() {
  console.log("\n--- Backfilling events ---");

  const { data: events, error } = await supabase
    .from("events")
    .select("id, name, description")
    .is("name_en", null)
    .order("date", { ascending: true });

  if (error) {
    console.error("Failed to fetch events:", error.message);
    return;
  }

  console.log(`Found ${events.length} events to translate`);

  let translated = 0;
  for (let i = 0; i < events.length; i += BATCH_SIZE) {
    const batch = events.slice(i, i + BATCH_SIZE);

    // Collect all texts for this batch (name + description interleaved)
    const textsToTranslate: string[] = [];
    for (const event of batch) {
      textsToTranslate.push(event.name || "");
      textsToTranslate.push(event.description || "");
    }

    try {
      const translations = await translateTexts(textsToTranslate);

      // Update each record
      for (let j = 0; j < batch.length; j++) {
        const event = batch[j];
        const nameEn = translations[j * 2] || null;
        const descEn = translations[j * 2 + 1] || null;

        const { error: updateError } = await supabase
          .from("events")
          .update({ name_en: nameEn, description_en: descEn })
          .eq("id", event.id);

        if (updateError) {
          console.error(`  Failed to update event ${event.id}:`, updateError.message);
        } else {
          translated++;
          console.log(`  [${translated}/${events.length}] ${event.name} -> ${nameEn}`);
        }
      }
    } catch (err) {
      console.error(`  Batch error at offset ${i}:`, err);
    }

    if (i + BATCH_SIZE < events.length) {
      await sleep(DELAY_MS);
    }
  }

  console.log(`Events done: ${translated}/${events.length} translated`);
}

async function backfillPresentations() {
  console.log("\n--- Backfilling presentations ---");

  const { data: presentations, error } = await supabase
    .from("presentations")
    .select("id, title, description")
    .is("title_en", null)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch presentations:", error.message);
    return;
  }

  console.log(`Found ${presentations.length} presentations to translate`);

  let translated = 0;
  for (let i = 0; i < presentations.length; i += BATCH_SIZE) {
    const batch = presentations.slice(i, i + BATCH_SIZE);

    const textsToTranslate: string[] = [];
    for (const pres of batch) {
      textsToTranslate.push(pres.title || "");
      textsToTranslate.push(pres.description || "");
    }

    try {
      const translations = await translateTexts(textsToTranslate);

      for (let j = 0; j < batch.length; j++) {
        const pres = batch[j];
        const titleEn = translations[j * 2] || null;
        const descEn = translations[j * 2 + 1] || null;

        const { error: updateError } = await supabase
          .from("presentations")
          .update({ title_en: titleEn, description_en: descEn })
          .eq("id", pres.id);

        if (updateError) {
          console.error(`  Failed to update presentation ${pres.id}:`, updateError.message);
        } else {
          translated++;
          console.log(`  [${translated}/${presentations.length}] ${pres.title} -> ${titleEn}`);
        }
      }
    } catch (err) {
      console.error(`  Batch error at offset ${i}:`, err);
    }

    if (i + BATCH_SIZE < presentations.length) {
      await sleep(DELAY_MS);
    }
  }

  console.log(`Presentations done: ${translated}/${presentations.length} translated`);
}

async function main() {
  console.log("Starting translation backfill (Gemini)...");
  console.log(`Supabase: ${supabaseUrl}`);
  console.log(`Batch size: ${BATCH_SIZE}, Delay: ${DELAY_MS}ms`);
  console.log(`Estimated time: ~${Math.ceil(260 / BATCH_SIZE) * (DELAY_MS / 1000)}s\n`);

  await backfillEvents();
  await backfillPresentations();

  console.log("\nBackfill complete!");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
