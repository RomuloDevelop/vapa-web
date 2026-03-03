import { getSession } from "@/lib/auth";
import { captureError } from "@/lib/error-tracking";
import { ActionError } from "./action-result";
import type { ActionResult } from "./action-result";

// Re-export types and utilities so server action files only need one import
export { ActionError, unwrap } from "./action-result";
export type { ActionResult, ActionErrorData, ErrorCode } from "./action-result";

// ─── Auth Check ──────────────────────────────────────────────────────────────

export async function requireAuth(): Promise<void> {
  const session = await getSession();

  if (!session?.user) {
    throw new ActionError("UNAUTHORIZED", "Not authenticated");
  }

  if ((session.user as Record<string, unknown>).isActive === false) {
    throw new ActionError("UNAUTHORIZED", "Your account is pending approval");
  }
}

export async function requireAdmin(): Promise<void> {
  const session = await getSession();

  if (!session?.user) {
    throw new ActionError("UNAUTHORIZED", "Not authenticated");
  }

  const user = session.user as Record<string, unknown>;

  if (user.isActive === false) {
    throw new ActionError("UNAUTHORIZED", "Your account is pending approval");
  }

  if (user.role !== "admin") {
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
      captureError(error, { tags: { area: "server-action" } });
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
