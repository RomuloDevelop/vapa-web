-- Migration: Create unified users table with roles
-- Single Auth.js email/password system. Users have roles: 'admin' or 'member'.

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT,                    -- NULL until user sets password via invitation
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',   -- 'admin' | 'member'
  membership_tier TEXT DEFAULT 'active', -- 'student' | 'active' | 'in_transition'
  is_active BOOLEAN NOT NULL DEFAULT true,
  invitation_token TEXT,                 -- One-time token for setting password
  invitation_expires TIMESTAMPTZ,        -- Token expiry
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_role ON users (role);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
