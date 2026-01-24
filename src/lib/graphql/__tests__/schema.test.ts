import { describe, expect, it } from "vitest";
import { createRequire } from "node:module";
import { typeDefs, resolvers } from "@/lib/graphql/schema";

const require = createRequire(import.meta.url);
const { graphql } = require("graphql") as typeof import("graphql");
const { makeExecutableSchema } = require("@graphql-tools/schema") as typeof import("@graphql-tools/schema");

const homeQuery = /* GraphQL */ `
  query Home($slug: String!, $query: String) {
    content(slug: $slug) {
      id
      slug
      title
    }
    products(query: $query) {
      id
      name
    }
    orders {
      id
      total
    }
  }
`;

const createOrderMutation = /* GraphQL */ `
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      total
      status
    }
  }
`;

describe("graphql schema", () => {
  it("returns data for the home query", async () => {
    process.env.NODE_ENV = "production";
    process.env.DEV_MODE = "true";

    const result = await graphql({
      schema: makeExecutableSchema({ typeDefs, resolvers }),
      source: homeQuery,
      variableValues: { slug: "home", query: "runner" },
    });

    expect(result.errors).toBeUndefined();
    const data = result.data as {
      content: { slug: string } | null;
      products: Array<{ id: string }>;
      orders: Array<{ id: string }>;
    };
    expect(data.content?.slug).toBe("home");
    expect(data.products.length).toBeGreaterThan(0);
    expect(data.orders.length).toBeGreaterThan(0);
  });

  it("creates an order via mutation", async () => {
    process.env.NODE_ENV = "production";
    process.env.DEV_MODE = "true";

    const result = await graphql({
      schema: makeExecutableSchema({ typeDefs, resolvers }),
      source: createOrderMutation,
      variableValues: {
        input: {
          items: [
            { productId: "pr_aurora_sneaker", quantity: 1 },
            { productId: "pr_lumen_lamp", quantity: 2 },
          ],
          email: "graphql@example.com",
        },
      },
    });

    expect(result.errors).toBeUndefined();
    const data = result.data as {
      createOrder: { id: string; total: number; status: string };
    };
    expect(data.createOrder.id).toMatch(/^ord_/);
    expect(data.createOrder.total).toBe(332);
    expect(data.createOrder.status).toBe("new");
  });
});
