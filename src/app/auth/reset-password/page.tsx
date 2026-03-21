"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { Lock, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/lib/schemas";
import {
  validateResetToken,
  resetPassword,
} from "@/lib/actions/auth";

const inputClass =
  "w-full px-4 py-3 rounded-lg bg-surface border border-border-accent-light text-foreground placeholder:text-foreground-faint text-sm focus:outline-none focus:border-accent transition-colors";

const errorInputClass =
  "w-full px-4 py-3 rounded-lg bg-surface border border-red-500 text-foreground placeholder:text-foreground-faint text-sm focus:outline-none focus:border-red-500 transition-colors";

async function submitResetPassword(
  _key: string,
  { arg }: { arg: { token: string; password: string } }
) {
  return resetPassword(arg.token, arg.password);
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  // Auto-validate token on mount
  const { data: validation, isLoading } = useSWR(
    token ? ["reset-token-validation", token] : null,
    () => validateResetToken(token!)
  );

  // User-triggered password reset
  const {
    trigger,
    data: resetResult,
    isMutating,
    error: resetError,
  } = useSWRMutation("reset-password", submitResetPassword);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  // Derive state from SWR data
  const isInvalid = !token || (validation && !validation.valid);
  const isSuccess = resetResult?.success === true;
  const serverError =
    resetResult && !resetResult.success
      ? resetResult.error || "Something went wrong."
      : resetError
        ? "Something went wrong."
        : null;

  // Redirect to login after success
  if (isSuccess) {
    setTimeout(() => router.push("/login"), 3000);
  }

  const onSubmit = (data: ResetPasswordFormValues) => {
    trigger({ token: token!, password: data.password });
  };

  return (
    <div className="w-full max-w-[400px] flex flex-col gap-8 p-8 rounded-xl bg-surface-section border border-border-accent-light">
      {isLoading && (
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-foreground-muted">
            Validating reset link...
          </p>
        </div>
      )}

      {!isLoading && isInvalid && (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-400/10">
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Invalid Reset Link</h1>
          <p className="text-sm text-foreground-muted leading-relaxed">
            This password reset link is invalid or has expired. Please request a
            new one.
          </p>
          <div className="flex items-center gap-4 mt-1">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-accent hover:underline"
            >
              Request a new reset link
            </Link>
            <span className="text-foreground-faint">|</span>
            <Link
              href="/"
              className="text-sm text-foreground-muted hover:text-accent transition-colors"
            >
              Return to site
            </Link>
          </div>
        </div>
      )}

      {!isLoading && !isInvalid && isSuccess && (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent-20">
            <CheckCircle className="w-6 h-6 text-accent" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Password Reset!</h1>
          <p className="text-sm text-foreground-muted leading-relaxed">
            Your password has been reset successfully. Redirecting to login...
          </p>
        </div>
      )}

      {!isLoading && !isInvalid && !isSuccess && (
        <>
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent-20">
              <Lock className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              Reset Your Password
            </h1>
            <p className="text-sm text-foreground-muted text-center">
              Enter your new password below.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground-muted"
              >
                New Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                className={errors.password ? errorInputClass : inputClass}
              />
              {errors.password && (
                <span className="text-xs text-red-400">
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-foreground-muted"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                placeholder="Repeat password"
                autoComplete="new-password"
                className={
                  errors.confirmPassword ? errorInputClass : inputClass
                }
              />
              {errors.confirmPassword && (
                <span className="text-xs text-red-400">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            {serverError && (
              <p className="text-sm text-red-400 bg-red-400/10 px-4 py-3 rounded-lg">
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={isMutating}
              className="w-full py-3.5 bg-accent text-surface text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isMutating ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>

          <div className="flex justify-center">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-foreground-muted hover:text-accent transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to site
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-5">
      <Suspense
        fallback={
          <div className="w-full max-w-[400px] flex flex-col items-center gap-3 p-8 rounded-xl bg-surface-section border border-border-accent-light">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-foreground-muted">Loading...</p>
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
