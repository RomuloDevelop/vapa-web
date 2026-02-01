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
CREATE INDEX idx_events_date ON events(date DESC);

-- Create index on type for filtering
CREATE INDEX idx_events_type ON events(type);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (no auth required)
CREATE POLICY "Events are viewable by everyone"
  ON events
  FOR SELECT
  USING (true);

-- Note: INSERT/UPDATE/DELETE operations should be done server-side
-- using the service role key which bypasses RLS
