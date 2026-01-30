import { makeExecutableSchema } from "@graphql-tools/schema";
import {
  addBasketItem,
  createBasket,
  getBasketById,
  removeBasketItem,
  updateBasketItem,
} from "@/lib/services/basket";
import { createOrder, createOrderFromBasket, listOrders } from "@/lib/services/orders";
import { createPayment, getPaymentById } from "@/lib/services/payments";
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

  type BasketItem {
    productId: ID!
    quantity: Int!
    price: Float!
  }

  type Basket {
    id: ID!
    items: [BasketItem!]!
    total: Float!
    currency: String!
    country: String!
    status: String!
    createdAt: String!
    updatedAt: String!
  }

  type Payment {
    id: ID!
    amount: Float!
    currency: String!
    status: String!
    orderId: ID
    createdAt: String!
    updatedAt: String!
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
    basket(id: ID!): Basket
    payment(id: ID!): Payment
  }

  input OrderItemInput {
    productId: ID!
    quantity: Int!
  }

  input CreateOrderInput {
    items: [OrderItemInput!]!
    email: String
  }

  input CreateBasketInput {
    items: [OrderItemInput!]
    email: String
    currency: String
    country: String
  }

  input BasketItemUpdateInput {
    basketId: ID!
    productId: ID!
    quantity: Int!
  }

  input BasketItemRemoveInput {
    basketId: ID!
    productId: ID!
  }

  input CreateOrderFromBasketInput {
    basketId: ID!
  }

  input CreatePaymentInput {
    amount: Float!
    currency: String
    orderId: ID
    status: String
  }

  type Mutation {
    createOrder(input: CreateOrderInput!): Order!
    createBasket(input: CreateBasketInput!): Basket!
    addBasketItem(input: BasketItemUpdateInput!): Basket!
    updateBasketItem(input: BasketItemUpdateInput!): Basket!
    removeBasketItem(input: BasketItemRemoveInput!): Basket!
    createOrderFromBasket(input: CreateOrderFromBasketInput!): Order!
    createPayment(input: CreatePaymentInput!): Payment!
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
    basket: async (_: unknown, args: { id: string }) => getBasketById(args.id),
    payment: async (_: unknown, args: { id: string }) => getPaymentById(args.id),
  },
  Mutation: {
    createOrder: async (
      _: unknown,
      args: { input: { items: Array<{ productId: string; quantity: number }>; email?: string } }
    ) => {
      return createOrder(args.input);
    },
    createBasket: async (
      _: unknown,
      args: {
        input: {
          items?: Array<{ productId: string; quantity: number }> | null;
          email?: string | null;
          currency?: string | null;
          country?: string | null;
        };
      }
    ) => {
      return createBasket({
        items: args.input.items ?? undefined,
        email: args.input.email ?? undefined,
        currency: args.input.currency ?? undefined,
        country: args.input.country ?? undefined,
      });
    },
    addBasketItem: async (
      _: unknown,
      args: { input: { basketId: string; productId: string; quantity: number } }
    ) => {
      return addBasketItem(args.input);
    },
    updateBasketItem: async (
      _: unknown,
      args: { input: { basketId: string; productId: string; quantity: number } }
    ) => {
      return updateBasketItem(args.input);
    },
    removeBasketItem: async (
      _: unknown,
      args: { input: { basketId: string; productId: string } }
    ) => {
      return removeBasketItem(args.input);
    },
    createOrderFromBasket: async (
      _: unknown,
      args: { input: { basketId: string } }
    ) => {
      return createOrderFromBasket(args.input);
    },
    createPayment: async (
      _: unknown,
      args: {
        input: {
          amount: number;
          currency?: string | null;
          orderId?: string | null;
          status?: string | null;
        };
      }
    ) => {
      return createPayment({
        amount: args.input.amount,
        currency: args.input.currency ?? undefined,
        orderId: args.input.orderId ?? undefined,
        status: (args.input.status ?? undefined) as
          | "pending"
          | "authorized"
          | "paid"
          | "failed"
          | undefined,
      });
    },
  },
};

export const schema = makeExecutableSchema({ typeDefs, resolvers });
