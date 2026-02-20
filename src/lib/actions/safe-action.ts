import { auth } from "@/lib/auth";
import { ActionError } from "./action-result";
import type { ActionResult } from "./action-result";

// Re-export types and utilities so server action files only need one import
export { ActionError, unwrap } from "./action-result";
export type { ActionResult, ActionErrorData, ErrorCode } from "./action-result";

// ─── Auth Check ──────────────────────────────────────────────────────────────

export async function requireAuth(): Promise<void> {
  const session = await auth();

  if (!session?.user) {
    throw new ActionError("UNAUTHORIZED", "Not authenticated");
  }
}

export async function requireAdmin(): Promise<void> {
  const session = await auth();

  if (!session?.user) {
    throw new ActionError("UNAUTHORIZED", "Not authenticated");
  }

  if (session.user.role !== "admin") {
    throw new ActionError("UNAUTHORIZED", "Unauthorized");
  }
}

// ─── Wrapper: safeAction ─────────────────────────────────────────────────────

export function safeAction<TArgs extends unknown[], TData = void>(
  fn: (...args: TArgs) => Promise<TData>
): (...args: TArgs) => Promise<ActionResult<TData>> {
  return async (...args: TArgs): Promise<ActionResult<TData>> => {
    try {
      const data = await fn(...args);
      return { success: true, data };
    } catch (error) {
      if (error instanceof ActionError) {
        return {
          success: false,
          error: {
            code: error.code,
            message: error.message,
            ...(error.fields && { fields: error.fields }),
          },
        };
      }

      console.error("[safeAction] Unexpected error:", error);
      return {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: "An unexpected error occurred. Please try again.",
        },
      };
    }
  };
}

// ─── Wrapper: memberAction (any authenticated user) ─────────────────────────

export function memberAction<TArgs extends unknown[], TData = void>(
  fn: (...args: TArgs) => Promise<TData>
): (...args: TArgs) => Promise<ActionResult<TData>> {
  return safeAction(async (...args: TArgs): Promise<TData> => {
    await requireAuth();
    return fn(...args);
  });
}

// ─── Wrapper: adminAction ────────────────────────────────────────────────────

export function adminAction<TArgs extends unknown[], TData = void>(
  fn: (...args: TArgs) => Promise<TData>
): (...args: TArgs) => Promise<ActionResult<TData>> {
  return safeAction(async (...args: TArgs): Promise<TData> => {
    await requireAdmin();
    return fn(...args);
  });
}
