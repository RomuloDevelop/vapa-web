-- Enable pg_cron extension (requires Supabase dashboard to enable first)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule nightly cleanup of pending self-registered users older than 2 months
-- Runs at 3:00 AM UTC every day
-- Targets users who self-registered (password_hash IS NOT NULL) but were never approved (is_active = false)
-- Admin-invited users (password_hash IS NULL) are excluded
SELECT cron.schedule(
  'cleanup-pending-users',
  '0 3 * * *',
  $$DELETE FROM users WHERE is_active = false AND password_hash IS NOT NULL AND created_at < now() - interval '2 months'$$
);
