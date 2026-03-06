-- Enable RLS on Better Auth tables to prevent unauthorized access via anon key.
-- No policies are added intentionally: all access goes through the secret key
-- or direct DATABASE_URL connection, both of which bypass RLS.

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE session ENABLE ROW LEVEL SECURITY;
ALTER TABLE account ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification ENABLE ROW LEVEL SECURITY;
