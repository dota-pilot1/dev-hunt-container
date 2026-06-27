"use client";

import { useTranslation } from "react-i18next";
import { ForgotPasswordForm } from "@/features/auth/password-reset/ForgotPasswordForm";
import { AuthLayout } from "@/shared/ui/AuthLayout";

export default function ForgotPasswordPage() {
  const { t } = useTranslation("auth");

  return (
    <AuthLayout title={t("forgotPasswordTitle")} subtitle={t("forgotPasswordSubtitle")}>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
