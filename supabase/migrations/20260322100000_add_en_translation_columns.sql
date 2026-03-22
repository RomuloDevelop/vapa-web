-- Add English translation columns to events and presentations tables
-- Admin writes in Spanish (name/description), DeepL translates to English (name_en/description_en)

-- Events
ALTER TABLE events ADD COLUMN name_en text;
ALTER TABLE events ADD COLUMN description_en text;

-- Presentations
ALTER TABLE presentations ADD COLUMN title_en text;
ALTER TABLE presentations ADD COLUMN description_en text;

-- Existing data is in Spanish — _en columns start as NULL.
-- Use the admin forms to translate existing records via DeepL.
