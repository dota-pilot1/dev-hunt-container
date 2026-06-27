import { api } from "@/shared/api/axios";
import type {
  LoginRequest,
  PasswordResetConfirmRequest,
  PasswordResetRequest,
  PasswordResetResponse,
  SignupRequest,
  SignupResponse,
  TokenResponse,
  User,
} from "../model/types";

export const authApi = {
  signup: (body: SignupRequest) =>
    api.post<SignupResponse>("/api/auth/signup", body).then((r) => r.data),

  checkEmail: (email: string) =>
    api
      .get<{ available: boolean }>("/api/auth/check-email", { params: { email } })
      .then((r) => r.data.available),

  login: (body: LoginRequest) =>
    api.post<TokenResponse>("/api/auth/login", body).then((r) => r.data),

  requestPasswordReset: (body: PasswordResetRequest) =>
    api.post<PasswordResetResponse>("/api/auth/password-reset/request", body).then((r) => r.data),

  confirmPasswordReset: (body: PasswordResetConfirmRequest) =>
    api.post<void>("/api/auth/password-reset/confirm", body),

  me: () =>
    api.get<User>("/api/auth/me").then((r) => r.data),

  logout: () =>
    api.post<void>("/api/auth/logout"),
};
