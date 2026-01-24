import { describe, expect, it } from "vitest";
import { createOrder, listOrders } from "@/lib/services/orders";

describe("order service", () => {
  it("creates an order with totals", async () => {
    const order = await createOrder({
      items: [
        { productId: "pr_aurora_sneaker", quantity: 1 },
        { productId: "pr_lumen_lamp", quantity: 2 },
      ],
      email: "tester@example.com",
    });

    expect(order.id).toMatch(/^ord_/);
    expect(order.total).toBe(332);
    expect(order.status).toBe("new");
    expect(order.items).toHaveLength(2);
  });

  it("lists stored orders", async () => {
    const orders = await listOrders();
    expect(orders.length).toBeGreaterThan(0);
  });
});
