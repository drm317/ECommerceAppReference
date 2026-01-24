import { mockOrders, mockProducts } from "@/lib/data/mock-data";
import type { Order, OrderItem } from "@/lib/types";

const orders: Order[] = [...mockOrders];

const calculateTotal = (items: OrderItem[]): number =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const listOrders = async (): Promise<Order[]> => {
  return orders;
};

export const createOrder = async (input: {
  items: Array<{ productId: string; quantity: number }>;
  email?: string | null;
}): Promise<Order> => {
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
