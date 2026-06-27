"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ResetPasswordForm } from "@/features/auth/password-reset/ResetPasswordForm";
import { AuthLayout } from "@/shared/ui/AuthLayout";

function ResetPasswordPageInner() {
  const { t } = useTranslation("auth");
  const params = useSearchParams();
  const token = params.get("token") ?? undefined;

  return (
    <AuthLayout title={t("resetPasswordTitle")} subtitle={t("resetPasswordSubtitle")}>
      <ResetPasswordForm token={token} />
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordPageInner />
    </Suspense>
  );
}
