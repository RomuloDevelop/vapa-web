"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus, ArrowLeft, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { registerSchema, type RegisterFormValues } from "@/lib/schemas";
import { registerUser } from "@/lib/actions/auth";

const inputClass =
  "w-full px-4 py-3 rounded-lg bg-surface border text-white placeholder:text-foreground-faint text-sm focus:outline-none transition-colors border-border-accent-light focus:border-accent";

const errorInputClass =
  "w-full px-4 py-3 rounded-lg bg-surface border text-white placeholder:text-foreground-faint text-sm focus:outline-none transition-colors border-red-500 focus:border-red-500";

function RegisterForm() {
  const t = useTranslations("Auth");
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    setServerError(null);

    const result = await registerUser(data);

    if (!result.success) {
      setServerError(result.error || "Something went wrong.");
      setLoading(false);
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <div className="w-full max-w-[400px] flex flex-col gap-6 p-8 rounded-xl bg-surface-section border border-border-accent-light">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent-20">
            <CheckCircle className="w-6 h-6 text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-white">{t("registrationSubmitted")}</h1>
          <p className="text-sm text-foreground-muted text-center">
            {t("registrationPendingDesc")}
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Link
            href="/login"
            className="w-full py-3.5 bg-accent text-surface text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity text-center"
          >
            {t("goToSignIn")}
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-foreground-muted hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("returnToSite")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[400px] flex flex-col gap-8 p-8 rounded-xl bg-surface-section border border-border-accent-light">
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent-20">
          <UserPlus className="w-6 h-6 text-accent" />
        </div>
        <h1 className="text-2xl font-bold text-white">{t("createAccount")}</h1>
        <p className="text-sm text-foreground-muted text-center">
          {t("createAccountDesc")}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex gap-3">
          <div className="flex flex-col gap-2 flex-1">
            <label
              htmlFor="firstName"
              className="text-sm font-medium text-foreground-muted"
            >
              {t("firstName")}
            </label>
            <input
              id="firstName"
              type="text"
              {...register("firstName")}
              placeholder={t("firstNamePlaceholder")}
              autoComplete="given-name"
              className={errors.firstName ? errorInputClass : inputClass}
            />
            {errors.firstName && (
              <span className="text-xs text-red-400">
                {errors.firstName.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 flex-1">
            <label
              htmlFor="lastName"
              className="text-sm font-medium text-foreground-muted"
            >
              {t("lastName")}
            </label>
            <input
              id="lastName"
              type="text"
              {...register("lastName")}
              placeholder={t("lastNamePlaceholder")}
              autoComplete="family-name"
              className={errors.lastName ? errorInputClass : inputClass}
            />
            {errors.lastName && (
              <span className="text-xs text-red-400">
                {errors.lastName.message}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-foreground-muted"
          >
            {t("emailAddress")}
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            placeholder={t("emailPlaceholder")}
            autoComplete="email"
            className={errors.email ? errorInputClass : inputClass}
          />
          {errors.email && (
            <span className="text-xs text-red-400">
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-foreground-muted"
          >
            {t("password")}
          </label>
          <input
            id="password"
            type="password"
            {...register("password")}
            placeholder={t("atLeast8Chars")}
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
            {t("confirmPassword")}
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
            placeholder={t("confirmPasswordPlaceholder")}
            autoComplete="new-password"
            className={errors.confirmPassword ? errorInputClass : inputClass}
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
          disabled={loading}
          className="w-full py-3.5 bg-accent text-surface text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? t("creatingAccount") : t("createAccount")}
        </button>
      </form>

      <div className="flex flex-col items-center gap-3">
        <p className="text-sm text-foreground-muted">
          {t("alreadyHaveAccount")}{" "}
          <Link href="/login" className="text-accent hover:underline">
            {t("signIn")}
          </Link>
        </p>
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-foreground-muted hover:text-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("returnToSite")}
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-5 py-10">
      <RegisterForm />
    </div>
  );
}
