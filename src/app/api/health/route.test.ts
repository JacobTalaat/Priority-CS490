import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

const { mockQueryRaw } = vi.hoisted(() => ({ mockQueryRaw: vi.fn() }));

vi.mock("@/lib/prisma", () => ({
  prisma: { $queryRaw: mockQueryRaw },
}));

describe("GET /api/health", () => {
  beforeEach(() => {
    mockQueryRaw.mockReset();
  });

  it("returns 200 and ok when the database answers the query", async () => {
    mockQueryRaw.mockResolvedValue([{ "?column?": 1 }]);
    const res = await GET();
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ status: "ok" });
  });

  it("returns 503 and error when the database query throws", async () => {
    mockQueryRaw.mockRejectedValue(new Error("database unavailable"));
    const res = await GET();
    expect(res.status).toBe(503);
    await expect(res.json()).resolves.toEqual({ status: "error" });
  });
});
