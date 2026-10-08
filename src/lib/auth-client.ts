import { apiRequest } from "./api-client";

// Must match the minimum enforced by /api/auth/signup and /api/auth/login.
export const MIN_PASSWORD_LENGTH = 8;

export type Credentials = {
  email: string;
  password: string;
};

export type FieldErrors = Partial<Record<keyof Credentials, string>>;

export type AuthUser = {
  id: string;
  email: string;
};

type AuthResponse = {
  token: string;
  user: AuthUser;
};

export type AuthResult =
  | { ok: true; token: string; user: AuthUser }
  | { ok: false; fieldErrors: FieldErrors; formError?: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateSignUp({ email, password }: Credentials): FieldErrors {
  const errors: FieldErrors = {};
  const trimmed = email.trim();
  if (!trimmed) {
    errors.email = "Enter your email.";
  } else if (!EMAIL_PATTERN.test(trimmed)) {
    errors.email = "Enter a valid email, like name@school.edu.";
  }
  if (!password) {
    errors.password = "Choose a password.";
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password is too weak. Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return errors;
}

export async function signUp({ email, password }: Credentials): Promise<AuthResult> {
  const result = await apiRequest<AuthResponse>("/api/auth/signup", {
    method: "POST",
    body: { email: email.trim(), password },
  });
  if (result.ok) {
    return { ok: true, token: result.data.token, user: result.data.user };
  }
  if (result.status === 409) {
    return { ok: false, fieldErrors: { email: "That email already has an account." } };
  }
  if (result.status === 400) {
    return { ok: false, fieldErrors: {}, formError: "Check your email and password and try again." };
  }
  return { ok: false, fieldErrors: {}, formError: result.error };
}
