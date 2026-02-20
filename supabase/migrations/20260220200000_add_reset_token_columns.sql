-- Add password-reset columns to the users table
ALTER TABLE users
  ADD COLUMN reset_token TEXT,
  ADD COLUMN reset_expires TIMESTAMPTZ;

CREATE INDEX idx_users_reset_token ON users (reset_token);
