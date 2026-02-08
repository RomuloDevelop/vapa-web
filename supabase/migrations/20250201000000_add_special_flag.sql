-- Add special events flag to events table
ALTER TABLE events ADD COLUMN is_special BOOLEAN NOT NULL DEFAULT false;

-- Index for efficient filtering
CREATE INDEX idx_events_is_special ON events(is_special);
