import { beforeEach, describe, expect, it, vi } from "vitest";

const loadContentService = async () => {
  vi.resetModules();
  return import("@/lib/services/content");
};

describe("content service", () => {
  beforeEach(() => {
    process.env.NODE_ENV = "production";
    process.env.DEV_MODE = "true";
  });

  it("returns the mock content page in dev mode", async () => {
    const { getContentPage } = await loadContentService();
    const page = await getContentPage("home");
    expect(page?.slug).toBe("home");
    expect(page?.blocks.length).toBeGreaterThan(0);
  });
});
