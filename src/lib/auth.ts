import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { mcp } from "better-auth/plugins";
import { APIError, createAuthMiddleware } from "better-auth/api";
import type { BetterAuthPlugin } from "better-auth";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * When an AI chat sent the user to /login, the `mcp` plugin answers the sign-in with a 302 to the chat.
 * The login form signs in with a background request, which can't open that link, so hand the URL back
 * the way better-auth's client expects ({ redirect, url }): the client then navigates there itself.
 * Must come after mcp() — plugin hooks run in order.
 */
function mcpLoginRedirect() {
  return {
    id: "mcp-login-redirect",
    hooks: {
      after: [
        {
          matcher: (ctx) => ctx.path === "/sign-in/email",
          handler: createAuthMiddleware(async (ctx) => {
            const returned = ctx.context.returned;
            if (!(returned instanceof APIError) || returned.status !== "FOUND") return;
            const url = new Headers(returned.headers).get("location");
            if (url) return ctx.json({ redirect: true, url });
          }),
        },
      ],
    },
  } satisfies BetterAuthPlugin;
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [process.env.BETTER_AUTH_URL!],

  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),

  // Map Better Auth's "user" model to our existing "users" table
  user: {
    modelName: "users",
    fields: {
      emailVerified: "email_verified",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "member",
        input: false,
      },
      membershipTier: {
        type: "string",
        fieldName: "membership_tier",
        required: false,
        defaultValue: "active",
        input: false,
      },
      isActive: {
        type: "boolean",
        fieldName: "is_active",
        required: false,
        defaultValue: true,
        input: false,
      },
    },
  },

  session: {
    modelName: "session",
    fields: {
      userId: "user_id",
      expiresAt: "expires_at",
      ipAddress: "ip_address",
      userAgent: "user_agent",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    expiresIn: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // Refresh if older than 1 hour
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 min cache to avoid DB lookups in middleware
    },
  },

  account: {
    modelName: "account",
    fields: {
      userId: "user_id",
      accountId: "account_id",
      providerId: "provider_id",
      accessToken: "access_token",
      refreshToken: "refresh_token",
      accessTokenExpiresAt: "access_token_expires_at",
      refreshTokenExpiresAt: "refresh_token_expires_at",
      idToken: "id_token",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },

  verification: {
    modelName: "verification",
    fields: {
      expiresAt: "expires_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },

  emailAndPassword: {
    enabled: true,
    password: {
      hash: async (password: string) => {
        return bcrypt.hash(password, 12);
      },
      verify: async (data: { password: string; hash: string }) => {
        return bcrypt.compare(data.password, data.hash);
      },
    },
  },

  // mcp: OAuth for AI chats (Claude, ChatGPT, …) calling /api/mcp — users log in on /login as usual
  plugins: [mcp({ loginPage: "/login" }), mcpLoginRedirect(), nextCookies()],
});

// ── Helper: get session in server components / actions ──────────────

export async function getSession() {
  const requestHeaders = await headers();
  return (await auth.api.getSession({ headers: requestHeaders })) ?? getMcpSession(requestHeaders);
}

/** An AI chat's MCP access token (`Authorization: Bearer …`) counts as its user's login. */
async function getMcpSession(requestHeaders: Headers) {
  if (!requestHeaders.get("authorization")?.startsWith("Bearer ")) return null;
  const token = await auth.api.getMcpSession({ headers: requestHeaders });
  // better-auth 1.4 returns expired tokens too, so check expiry here
  if (!token?.userId || new Date(token.accessTokenExpiresAt) <= new Date()) return null;
  const user = await (await auth.$context).internalAdapter.findUserById(token.userId);
  return user ? { user, session: null } : null;
}

/**
 * Require any authenticated user in a server component.
 * Redirects to login if no valid session exists.
 */
export async function requireMemberAuth() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }
  if ((session.user as Record<string, unknown>).isActive === false) {
    redirect("/login");
  }
  return session;
}

/**
 * Require admin role in a server component.
 * Redirects to login if not an admin.
 */
export async function requireAdminAuth() {
  const session = await getSession();
  if (!session?.user || (session.user as Record<string, unknown>).role !== "admin") {
    redirect("/login");
  }
  return session;
}
