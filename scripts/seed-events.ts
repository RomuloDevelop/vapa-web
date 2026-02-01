/**
 * Seed script to create events table and migrate existing events to Supabase
 *
 * Usage:
 * 1. Set up your .env.local with Supabase credentials
 * 2. Run: npx tsx scripts/seed-events.ts
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { Client } from "pg";
import { createClient } from "@supabase/supabase-js";
import { allEvents } from "./seeds/events";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;
const databaseUrl = process.env.DATABASE_URL;

if (!supabaseUrl || !supabaseSecretKey || !databaseUrl) {
  console.error("Missing environment variables:");
  console.error("- SUPABASE_URL");
  console.error("- SUPABASE_SECRET_KEY");
  console.error("- DATABASE_URL (PostgreSQL connection string)");
  process.exit(1);
}

const migrationSQL = `
-- Create events table for VAPA digital library
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  img TEXT NOT NULL,
  date DATE NOT NULL,
  type TEXT NOT NULL,
  time TEXT NOT NULL,
  presenters TEXT[] NOT NULL DEFAULT '{}',
  links TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on date for efficient filtering/sorting
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date DESC);

-- Create index on type for filtering
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (no auth required)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Events are viewable by everyone'
  ) THEN
    CREATE POLICY "Events are viewable by everyone" ON events FOR SELECT USING (true);
  END IF;
END
$$;
`;

async function createTable() {
  console.log("Creating events table...");

  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    await client.query(migrationSQL);
    console.log("Table created successfully!");
  } finally {
    await client.end();
  }
}

async function seedEvents() {
  const supabase = createClient(supabaseUrl!, supabaseSecretKey!);

  console.log(`Found ${allEvents.length} events to migrate...`);

  const eventsToInsert = allEvents.map((event) => ({
    name: event.name,
    img: event.img,
    date: event.date,
    type: event.type,
    time: event.time,
    presenters: event.presenters,
    links: event.links,
  }));

  const batchSize = 100;
  let inserted = 0;

  for (let i = 0; i < eventsToInsert.length; i += batchSize) {
    const batch = eventsToInsert.slice(i, i + batchSize);

    const { data, error } = await supabase.from("events").insert(batch).select();

    if (error) {
      console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
      throw error;
    }

    inserted += data?.length ?? 0;
    console.log(`Inserted ${inserted}/${eventsToInsert.length} events...`);
  }

  console.log(`\nMigration complete! ${inserted} events inserted.`);
}

async function main() {
  await createTable();
  await seedEvents();
}

main().catch(console.error);
