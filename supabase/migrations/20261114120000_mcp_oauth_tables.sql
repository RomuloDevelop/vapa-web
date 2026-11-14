-- Better Auth `mcp` plugin: OAuth tables for AI chats (Claude, ChatGPT, …) connecting to /api/mcp.
-- Generated with better-auth's getMigrations (v1.4.20). Only change: "userId" is UUID to match users.id.
-- Column names are camelCase because the plugin has no column mapping.

-- Chats that registered themselves (OAuth dynamic client registration)
CREATE TABLE IF NOT EXISTS "oauthApplication" (
  "id"           TEXT PRIMARY KEY,
  "name"         TEXT NOT NULL,
  "icon"         TEXT,
  "metadata"     TEXT,
  "clientId"     TEXT NOT NULL UNIQUE,
  "clientSecret" TEXT,
  "redirectUrls" TEXT NOT NULL,
  "type"         TEXT NOT NULL,
  "disabled"     BOOLEAN,
  "userId"       UUID REFERENCES users(id) ON DELETE CASCADE,
  "createdAt"    TIMESTAMPTZ NOT NULL,
  "updatedAt"    TIMESTAMPTZ NOT NULL
);

-- Access and refresh tokens issued to chats, one row per login
CREATE TABLE IF NOT EXISTS "oauthAccessToken" (
  "id"                    TEXT PRIMARY KEY,
  "accessToken"           TEXT NOT NULL UNIQUE,
  "refreshToken"          TEXT NOT NULL UNIQUE,
  "accessTokenExpiresAt"  TIMESTAMPTZ NOT NULL,
  "refreshTokenExpiresAt" TIMESTAMPTZ NOT NULL,
  "clientId"              TEXT NOT NULL REFERENCES "oauthApplication"("clientId") ON DELETE CASCADE,
  "userId"                UUID REFERENCES users(id) ON DELETE CASCADE,
  "scopes"                TEXT NOT NULL,
  "createdAt"             TIMESTAMPTZ NOT NULL,
  "updatedAt"             TIMESTAMPTZ NOT NULL
);

-- Consents users gave to chats
CREATE TABLE IF NOT EXISTS "oauthConsent" (
  "id"           TEXT PRIMARY KEY,
  "clientId"     TEXT NOT NULL REFERENCES "oauthApplication"("clientId") ON DELETE CASCADE,
  "userId"       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "scopes"       TEXT NOT NULL,
  "consentGiven" BOOLEAN NOT NULL,
  "createdAt"    TIMESTAMPTZ NOT NULL,
  "updatedAt"    TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_oauthApplication_userId"  ON "oauthApplication"("userId");
CREATE INDEX IF NOT EXISTS "idx_oauthAccessToken_clientId" ON "oauthAccessToken"("clientId");
CREATE INDEX IF NOT EXISTS "idx_oauthAccessToken_userId"   ON "oauthAccessToken"("userId");
CREATE INDEX IF NOT EXISTS "idx_oauthConsent_clientId"     ON "oauthConsent"("clientId");
CREATE INDEX IF NOT EXISTS "idx_oauthConsent_userId"       ON "oauthConsent"("userId");

-- Same as the other auth tables (20260306150000): no policies, only the secret key / DATABASE_URL can read them.
ALTER TABLE "oauthApplication" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "oauthAccessToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "oauthConsent"     ENABLE ROW LEVEL SECURITY;
