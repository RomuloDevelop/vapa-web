-- Normalize event type values to enum format
-- "Webinar" -> "webinar", "Special Event" -> "special_event", "Online" -> "webinar"
UPDATE events SET type = 'webinar' WHERE type IN ('Webinar', 'Online');
UPDATE events SET type = 'special_event' WHERE type = 'Special Event';

-- Drop the is_special column (replaced by type enum)
ALTER TABLE events DROP COLUMN IF EXISTS is_special;

-- Drop the old is_special index
DROP INDEX IF EXISTS idx_events_is_special;
