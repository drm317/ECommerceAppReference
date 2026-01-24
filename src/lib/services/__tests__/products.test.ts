import { beforeEach, describe, expect, it, vi } from "vitest";

const loadProductsService = async () => {
  vi.resetModules();
  return import("@/lib/services/products");
};

describe("product service", () => {
  beforeEach(() => {
    process.env.NODE_ENV = "production";
    process.env.DEV_MODE = "true";
  });

  it("returns mock products in dev mode", async () => {
    const { listProducts } = await loadProductsService();
    const products = await listProducts();
    expect(products.length).toBeGreaterThan(0);
  });

  it("filters products by query", async () => {
    const { listProducts } = await loadProductsService();
    const products = await listProducts("runner");
    expect(products.some((product) => product.name.includes("Runner"))).toBe(true);
  });
});
