import { createHash } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createSession, getUserFromRequest } from "./auth";

const { mockSessionCreate, mockSessionFindUnique } = vi.hoisted(() => ({
  mockSessionCreate: vi.fn(),
  mockSessionFindUnique: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    session: { create: mockSessionCreate, findUnique: mockSessionFindUnique },
  },
}));

function requestWithToken(token?: string) {
  const headers = new Headers();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return new Request("http://localhost/api/auth/me", { headers });
}

describe("createSession", () => {
  beforeEach(() => {
    mockSessionCreate.mockReset();
  });

  it("returns a token and stores only its sha256 hash", async () => {
    mockSessionCreate.mockResolvedValue({});
    const token = await createSession("user-1");
    expect(token).toBeTruthy();
    expect(mockSessionCreate).toHaveBeenCalledTimes(1);
    const data = mockSessionCreate.mock.calls[0][0].data;
    expect(data.tokenHash).toBe(createHash("sha256").update(token).digest("hex"));
    expect(data.tokenHash).not.toBe(token);
    expect(data.userId).toBe("user-1");
    expect(data.expiresAt.getTime()).toBeGreaterThan(Date.now());
  });
});

describe("getUserFromRequest", () => {
  beforeEach(() => {
    mockSessionFindUnique.mockReset();
  });

  it("returns null when there is no authorization header", async () => {
    const user = await getUserFromRequest(requestWithToken());
    expect(user).toBeNull();
    expect(mockSessionFindUnique).not.toHaveBeenCalled();
  });

  it("returns null when the header is not a Bearer header", async () => {
    const request = new Request("http://localhost/api/auth/me", {
      headers: { Authorization: "Basic dXNlcjpwYXNz" },
    });
    await expect(getUserFromRequest(request)).resolves.toBeNull();
    expect(mockSessionFindUnique).not.toHaveBeenCalled();
  });

  it("returns null when the token is unknown", async () => {
    mockSessionFindUnique.mockResolvedValue(null);
    await expect(getUserFromRequest(requestWithToken("unknown-token"))).resolves.toBeNull();
    expect(mockSessionFindUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tokenHash: createHash("sha256").update("unknown-token").digest("hex"),
        }),
      })
    );
  });

  it("returns null when the session has expired", async () => {
    mockSessionFindUnique.mockResolvedValue({
      expiresAt: new Date(Date.now() - 1000),
      user: { id: "user-1", email: "student@example.com" },
    });
    await expect(getUserFromRequest(requestWithToken("expired-token"))).resolves.toBeNull();
  });

  it("returns the user when the session is valid", async () => {
    const user = { id: "user-1", email: "student@example.com" };
    mockSessionFindUnique.mockResolvedValue({
      expiresAt: new Date(Date.now() + 60 * 1000),
      user,
    });
    await expect(getUserFromRequest(requestWithToken("valid-token"))).resolves.toEqual(user);
  });
});
