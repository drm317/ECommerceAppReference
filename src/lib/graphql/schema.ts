import { makeExecutableSchema } from "@graphql-tools/schema";
import { createOrder, listOrders } from "@/lib/services/orders";
import { getContentPage } from "@/lib/services/content";
import { getProductById, listProducts } from "@/lib/services/products";

export const typeDefs = /* GraphQL */ `
  type Product {
    id: ID!
    name: String!
    description: String!
    price: Float!
    imageUrl: String!
    tags: [String!]!
    inventory: Int!
    status: String!
  }

  type OrderItem {
    productId: ID!
    quantity: Int!
    price: Float!
  }

  type Order {
    id: ID!
    items: [OrderItem!]!
    total: Float!
    status: String!
    email: String
    createdAt: String!
  }

  type ContentBlock {
    id: ID!
    type: String!
    title: String!
    body: String
    imageUrl: String
  }

  type ContentPage {
    id: ID!
    slug: String!
    title: String!
    blocks: [ContentBlock!]!
  }

  type Query {
    products(query: String): [Product!]!
    product(id: ID!): Product
    content(slug: String!): ContentPage
    orders: [Order!]!
  }

  input OrderItemInput {
    productId: ID!
    quantity: Int!
  }

  input CreateOrderInput {
    items: [OrderItemInput!]!
    email: String
  }

  type Mutation {
    createOrder(input: CreateOrderInput!): Order!
  }
`;

export const resolvers = {
  Query: {
    products: async (_: unknown, args: { query?: string | null }) => {
      return listProducts(args.query);
    },
    product: async (_: unknown, args: { id: string }) => {
      return getProductById(args.id);
    },
    content: async (_: unknown, args: { slug: string }) => {
      return getContentPage(args.slug);
    },
    orders: async () => listOrders(),
  },
  Mutation: {
    createOrder: async (
      _: unknown,
      args: { input: { items: Array<{ productId: string; quantity: number }>; email?: string } }
    ) => {
      return createOrder(args.input);
    },
  },
};

export const schema = makeExecutableSchema({ typeDefs, resolvers });
