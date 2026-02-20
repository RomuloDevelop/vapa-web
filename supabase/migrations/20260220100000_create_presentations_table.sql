-- Migration: Create presentations table
-- Files stored in private 'presentations' bucket. Access controlled via
-- signed URLs generated server-side through memberAction-guarded actions.
-- No public RLS policy — all reads go through the service-role client.

CREATE TABLE presentations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  img TEXT NOT NULL,
  file_path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE presentations ENABLE ROW LEVEL SECURITY;
