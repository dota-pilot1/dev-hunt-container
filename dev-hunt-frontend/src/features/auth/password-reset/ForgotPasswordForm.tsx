"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { authApi } from "@/entities/user/api/authApi";
import { getApiError, isNetworkError } from "@/shared/api/errors";
import {
  passwordResetRequestSchema,
  type PasswordResetRequestFormValues,
} from "@/shared/lib/validation/auth.schema";
import { FormField } from "@/shared/ui/FormField";
import { TextInput } from "@/shared/ui/TextInput";

export function ForgotPasswordForm() {
  const { t } = useTranslation("auth");
  const [formError, setFormError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordResetRequestFormValues>({
    resolver: zodResolver(passwordResetRequestSchema),
    mode: "onBlur",
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const response = await authApi.requestPasswordReset({ email: values.email });
      setDevResetUrl(response.devResetUrl ?? null);
      setSent(true);
    } catch (e) {
      if (isNetworkError(e)) {
        setFormError(t("networkError"));
        return;
      }
      setFormError(getApiError(e)?.message ?? t("passwordResetRequestFailed"));
    }
  });

  if (sent) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          {devResetUrl ? t("passwordResetDevReady") : t("passwordResetSent")}
        </div>
        {devResetUrl ? (
          <Link
            href={devResetUrl}
            className="inline-flex w-full items-center justify-center rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            {t("openDevResetLink")}
          </Link>
        ) : null}
        <Link
          href="/login"
          className="inline-flex w-full items-center justify-center rounded-md border border-border bg-background py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          {t("backToLogin")}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {formError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{formError}</span>
        </div>
      )}

      <FormField label={t("email")} htmlFor="forgot-email" error={errors.email?.message}>
        <TextInput
          id="forgot-email"
          type="email"
          autoComplete="email"
          placeholder={t("emailPlaceholder")}
          invalid={!!errors.email}
          aria-invalid={!!errors.email}
          {...register("email")}
        />
      </FormField>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        <Mail className="h-4 w-4" />
        {isSubmitting ? t("sendingPasswordReset") : t("sendPasswordReset")}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/login" className="underline hover:text-foreground">
          {t("backToLogin")}
        </Link>
      </p>
    </form>
  );
}
