import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

const { mockSessionFindUnique } = vi.hoisted(() => ({
  mockSessionFindUnique: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    session: { findUnique: mockSessionFindUnique },
  },
}));

function meRequest(token?: string) {
  const headers = new Headers();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return new Request("http://localhost/api/auth/me", { headers });
}

describe("GET /api/auth/me", () => {
  beforeEach(() => {
    mockSessionFindUnique.mockReset();
  });

  it("returns 401 without a token", async () => {
    const res = await GET(meRequest());
    expect(res.status).toBe(401);
    await expect(res.json()).resolves.toEqual({ error: "Unauthorized" });
    expect(mockSessionFindUnique).not.toHaveBeenCalled();
  });

  it("returns 401 for an invalid token", async () => {
    mockSessionFindUnique.mockResolvedValue(null);
    const res = await GET(meRequest("nope"));
    expect(res.status).toBe(401);
    await expect(res.json()).resolves.toEqual({ error: "Unauthorized" });
  });

  it("returns 200 with the user for a valid token", async () => {
    mockSessionFindUnique.mockResolvedValue({
      expiresAt: new Date(Date.now() + 60 * 1000),
      user: { id: "user-1", email: "student@example.com" },
    });
    const res = await GET(meRequest("valid-token"));
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ id: "user-1", email: "student@example.com" });
  });
});
