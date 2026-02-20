"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWRMutation from "swr/mutation";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/lib/schemas";
import { requestPasswordReset } from "@/lib/actions/auth";

const inputClass =
  "w-full px-4 py-3 rounded-lg bg-surface border text-white placeholder:text-foreground-faint text-sm focus:outline-none transition-colors border-border-accent-light focus:border-accent";

const errorInputClass =
  "w-full px-4 py-3 rounded-lg bg-surface border text-white placeholder:text-foreground-faint text-sm focus:outline-none transition-colors border-red-500 focus:border-red-500";

async function sendResetEmail(
  _key: string,
  { arg }: { arg: { email: string } }
) {
  return requestPasswordReset(arg.email);
}

export default function ForgotPasswordPage() {
  const { trigger, data, isMutating } = useSWRMutation(
    "forgot-password",
    sendResetEmail
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (formData: ForgotPasswordFormValues) => {
    trigger({ email: formData.email });
  };

  const submitted = data?.success === true;

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-5">
      <div className="w-full max-w-[400px] flex flex-col gap-8 p-8 rounded-xl bg-surface-section border border-border-accent-light">
        {submitted ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent-20">
              <Mail className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-2xl font-bold text-white">Check Your Email</h1>
            <p className="text-sm text-foreground-muted leading-relaxed">
              If an account exists with that email address, we&apos;ve sent a
              link to reset your password. The link will expire in 1 hour.
            </p>
            <Link
              href="/login"
              className="flex items-center gap-2 text-sm text-accent hover:underline mt-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent-20">
                <Mail className="w-6 h-6 text-accent" />
              </div>
              <h1 className="text-2xl font-bold text-white">
                Forgot Password?
              </h1>
              <p className="text-sm text-foreground-muted text-center">
                Enter your email address and we&apos;ll send you a link to reset
                your password.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground-muted"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="your.email@example.com"
                  autoComplete="email"
                  className={errors.email ? errorInputClass : inputClass}
                />
                {errors.email && (
                  <span className="text-xs text-red-400">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={isMutating}
                className="w-full py-3.5 bg-accent text-surface text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isMutating ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <div className="flex justify-center">
              <Link
                href="/login"
                className="flex items-center gap-2 text-sm text-foreground-muted hover:text-accent transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
