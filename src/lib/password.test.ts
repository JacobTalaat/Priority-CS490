import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./password";

describe("hashPassword", () => {
  it("stores a salt:hash value that is not the plain password", () => {
    const stored = hashPassword("correct-horse");
    expect(stored).toMatch(/^[0-9a-f]+:[0-9a-f]+$/);
    expect(stored).not.toContain("correct-horse");
  });

  it("hashes the same password differently each time", () => {
    expect(hashPassword("correct-horse")).not.toBe(hashPassword("correct-horse"));
  });
});

describe("verifyPassword", () => {
  it("accepts the correct password", () => {
    const stored = hashPassword("correct-horse");
    expect(verifyPassword("correct-horse", stored)).toBe(true);
  });

  it("rejects a wrong password", () => {
    const stored = hashPassword("correct-horse");
    expect(verifyPassword("wrong-password", stored)).toBe(false);
  });
});
