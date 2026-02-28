-- Migration: Create donations table
-- Stores donation records from Stripe checkout.session.completed webhook events.

CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id TEXT NOT NULL UNIQUE,
  stripe_payment_intent TEXT,
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  billing_address_line1 TEXT,
  billing_address_line2 TEXT,
  billing_city TEXT,
  billing_state TEXT,
  billing_postal_code TEXT,
  billing_country TEXT,
  receipt_email_sent BOOLEAN NOT NULL DEFAULT false,
  donation_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for lookups by email (donor history)
CREATE INDEX idx_donations_email ON donations (donor_email);

-- Index for date-based queries (reporting)
CREATE INDEX idx_donations_date ON donations (donation_date DESC);

-- Enable Row Level Security (all access via service-role key)
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
