import { afterEach, describe, expect, it, vi } from "vitest";
import { signUp, validateSignUp } from "./auth-client";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("validateSignUp", () => {
  it("accepts a valid email and an 8 character password", () => {
    expect(validateSignUp({ email: "student@njit.edu", password: "12345678" })).toEqual({});
  });

  it("asks for an email when it is blank", () => {
    expect(validateSignUp({ email: "   ", password: "12345678" }).email).toBe("Enter your email.");
  });

  it("rejects an email without a domain", () => {
    expect(validateSignUp({ email: "student@", password: "12345678" }).email).toMatch(/valid email/);
  });

  it("asks for a password when it is blank", () => {
    expect(validateSignUp({ email: "student@njit.edu", password: "" }).password).toBe("Choose a password.");
  });

  it("calls a short password weak", () => {
    expect(validateSignUp({ email: "student@njit.edu", password: "1234567" }).password).toBe(
      "Password is too weak. Use at least 8 characters.",
    );
  });
});

describe("signUp", () => {
  it("returns the token and user on success", async () => {
    const fetchMock = vi.fn(async () =>
      Response.json({ token: "tok", user: { id: "u1", email: "student@njit.edu" } }, { status: 201 }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await signUp({ email: " student@njit.edu ", password: "12345678" });

    expect(result).toEqual({ ok: true, token: "tok", user: { id: "u1", email: "student@njit.edu" } });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/signup",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email: "student@njit.edu", password: "12345678" }),
      }),
    );
  });

  it("puts a taken email error on the email field", async () => {
    vi.stubGlobal("fetch", async () => Response.json({ error: "Email already registered" }, { status: 409 }));

    expect(await signUp({ email: "student@njit.edu", password: "12345678" })).toEqual({
      ok: false,
      fieldErrors: { email: "That email already has an account." },
    });
  });

  it("shows a form error when the server rejects the body", async () => {
    vi.stubGlobal("fetch", async () => Response.json({ error: "Invalid body" }, { status: 400 }));

    const result = await signUp({ email: "student@njit.edu", password: "12345678" });

    expect(result).toEqual({
      ok: false,
      fieldErrors: {},
      formError: "Check your email and password and try again.",
    });
  });

  it("passes through other errors", async () => {
    vi.stubGlobal("fetch", async () => {
      throw new TypeError("Failed to fetch");
    });

    const result = await signUp({ email: "student@njit.edu", password: "12345678" });

    expect(result.ok).toBe(false);
    expect(!result.ok && result.formError).toMatch(/Can't reach Priority/);
  });
});
