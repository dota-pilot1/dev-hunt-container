"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AlertCircle, KeyRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import { authApi } from "@/entities/user/api/authApi";
import { getApiError, isNetworkError } from "@/shared/api/errors";
import {
  passwordResetConfirmSchema,
  type PasswordResetConfirmFormValues,
} from "@/shared/lib/validation/auth.schema";
import { FormField } from "@/shared/ui/FormField";
import { PasswordInput } from "@/shared/ui/PasswordInput";

type ResetPasswordFormProps = {
  token?: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const { t } = useTranslation("auth");
  const [formError, setFormError] = useState<string | null>(token ? null : t("passwordResetInvalidLink"));

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordResetConfirmFormValues>({
    resolver: zodResolver(passwordResetConfirmSchema),
    mode: "onBlur",
  });

  const onSubmit = handleSubmit(async (values) => {
    if (!token) return;
    setFormError(null);
    try {
      await authApi.confirmPasswordReset({ token, newPassword: values.password });
      toast.success(t("passwordResetSuccess"));
      router.replace("/login");
    } catch (e) {
      if (isNetworkError(e)) {
        setFormError(t("networkError"));
        return;
      }
      setFormError(getApiError(e)?.message ?? t("passwordResetFailed"));
    }
  });

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

      <FormField
        label={t("newPassword")}
        htmlFor="reset-password"
        error={errors.password?.message}
        hint={errors.password ? undefined : t("passwordPlaceholder")}
      >
        <PasswordInput
          id="reset-password"
          autoComplete="new-password"
          invalid={!!errors.password}
          aria-invalid={!!errors.password}
          {...register("password")}
        />
      </FormField>

      <FormField
        label={t("passwordConfirm")}
        htmlFor="reset-password-confirm"
        error={errors.passwordConfirm?.message}
      >
        <PasswordInput
          id="reset-password-confirm"
          autoComplete="new-password"
          placeholder={t("passwordConfirmPlaceholder")}
          invalid={!!errors.passwordConfirm}
          aria-invalid={!!errors.passwordConfirm}
          {...register("passwordConfirm")}
        />
      </FormField>

      <button
        type="submit"
        disabled={isSubmitting || !token}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        <KeyRound className="h-4 w-4" />
        {isSubmitting ? t("resettingPassword") : t("resetPasswordButton")}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/login" className="underline hover:text-foreground">
          {t("backToLogin")}
        </Link>
      </p>
    </form>
  );
}
