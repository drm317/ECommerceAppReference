import { COMMERCETOOLS_ENABLED } from "@/lib/config/env";
import { mockOrders, mockProducts } from "@/lib/data/mock-data";
import { createBasket, getBasketById } from "@/lib/services/basket";
import { commercetoolsFetch } from "@/lib/services/commercetools";
import type { Order, OrderItem } from "@/lib/types";

type CTOrder = {
  id: string;
  createdAt: string;
  orderState?: string;
  lineItems: Array<{
    productId: string;
    quantity: number;
    price: { value: { centAmount: number } };
  }>;
  totalPrice: { centAmount: number; currencyCode: string };
  customerEmail?: string;
};

type CTCart = {
  id: string;
  version: number;
};

const orders: Order[] = [...mockOrders];

const calculateTotal = (items: OrderItem[]): number =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

const mapOrderStatus = (state?: string): Order["status"] => {
  switch (state) {
    case "Open":
      return "new";
    case "Confirmed":
    case "Complete":
      return "fulfilled";
    default:
      return "processing";
  }
};

const mapOrder = (order: CTOrder): Order => ({
  id: order.id,
  items: order.lineItems.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    price: item.price.value.centAmount / 100,
  })),
  total: order.totalPrice.centAmount / 100,
  status: mapOrderStatus(order.orderState),
  email: order.customerEmail ?? null,
  createdAt: order.createdAt,
});

export const listOrders = async (): Promise<Order[]> => {
  if (COMMERCETOOLS_ENABLED) {
    const response = await commercetoolsFetch<{ results: CTOrder[] }>("/orders");
    return response.results.map((order) => mapOrder(order));
  }

  return orders;
};

export const createOrder = async (input: {
  items: Array<{ productId: string; quantity: number }>;
  email?: string | null;
}): Promise<Order> => {
  if (COMMERCETOOLS_ENABLED) {
    const basket = await createBasket({ items: input.items, email: input.email });
    return createOrderFromBasket({ basketId: basket.id });
  }

  const items: OrderItem[] = input.items.map((item) => {
    const product = mockProducts.find((entry) => entry.id === item.productId);
    if (!product) {
      throw new Error(`Unknown product: ${item.productId}`);
    }

    return {
      productId: item.productId,
      quantity: item.quantity,
      price: product.price,
    };
  });

  const newOrder: Order = {
    id: `ord_${Math.floor(Math.random() * 9000 + 1000)}`,
    items,
    total: calculateTotal(items),
    status: "new",
    email: input.email ?? null,
    createdAt: new Date().toISOString(),
  };

  orders.unshift(newOrder);
  return newOrder;
};

export const createOrderFromBasket = async (input: {
  basketId: string;
}): Promise<Order> => {
  if (COMMERCETOOLS_ENABLED) {
    const cart = await commercetoolsFetch<CTCart>(`/carts/${input.basketId}`);
    const order = await commercetoolsFetch<CTOrder>("/orders", {
      method: "POST",
      body: JSON.stringify({
        id: cart.id,
        version: cart.version,
      }),
    });

    return mapOrder(order);
  }

  const basket = await getBasketById(input.basketId);
  if (!basket) {
    throw new Error(`Unknown basket: ${input.basketId}`);
  }

  const newOrder: Order = {
    id: `ord_${Math.floor(Math.random() * 9000 + 1000)}`,
    items: basket.items.map((item) => ({ ...item })),
    total: basket.total,
    status: "new",
    email: null,
    createdAt: new Date().toISOString(),
  };

  orders.unshift(newOrder);
  return newOrder;
};
