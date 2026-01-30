import { COMMERCETOOLS_ENABLED } from "@/lib/config/env";
import { mockBaskets, mockProducts } from "@/lib/data/mock-data";
import { commercetoolsFetch } from "@/lib/services/commercetools";
import type { Basket, BasketItem } from "@/lib/types";

type CTCart = {
  id: string;
  version: number;
  createdAt: string;
  lastModifiedAt: string;
  country: string;
  currency: string;
  totalPrice: { centAmount: number; currencyCode: string };
  lineItems: Array<{
    id: string;
    productId: string;
    quantity: number;
    price: { value: { centAmount: number } };
  }>;
};

const baskets = new Map<string, Basket>(
  mockBaskets.map((basket) => [basket.id, basket])
);

const calculateTotal = (items: BasketItem[]): number =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

const mapCart = (cart: CTCart): Basket => ({
  id: cart.id,
  items: cart.lineItems.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    price: item.price.value.centAmount / 100,
  })),
  total: cart.totalPrice.centAmount / 100,
  currency: cart.totalPrice.currencyCode,
  country: cart.country,
  status: "active",
  version: cart.version,
  createdAt: cart.createdAt,
  updatedAt: cart.lastModifiedAt,
});

const getMockBasket = (id: string): Basket | null => baskets.get(id) ?? null;

export const createBasket = async (input?: {
  items?: Array<{ productId: string; quantity: number }>;
  email?: string | null;
  currency?: string;
  country?: string;
}): Promise<Basket> => {
  if (COMMERCETOOLS_ENABLED) {
    const payload = {
      currency: input?.currency ?? "USD",
      country: input?.country ?? "US",
      customerEmail: input?.email ?? undefined,
      lineItems:
        input?.items?.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })) ?? [],
    };

    const cart = await commercetoolsFetch<CTCart>("/carts", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return mapCart(cart);
  }

  const items: BasketItem[] =
    input?.items?.map((item) => {
      const product = mockProducts.find((entry) => entry.id === item.productId);
      if (!product) {
        throw new Error(`Unknown product: ${item.productId}`);
      }

      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      };
    }) ?? [];

  const now = new Date().toISOString();
  const basket: Basket = {
    id: `cart_${Math.floor(Math.random() * 9000 + 1000)}`,
    items,
    total: calculateTotal(items),
    currency: input?.currency ?? "USD",
    country: input?.country ?? "US",
    status: "active",
    version: 1,
    createdAt: now,
    updatedAt: now,
  };

  baskets.set(basket.id, basket);
  return basket;
};

export const getBasketById = async (id: string): Promise<Basket | null> => {
  if (COMMERCETOOLS_ENABLED) {
    try {
      const cart = await commercetoolsFetch<CTCart>(`/carts/${id}`);
      return mapCart(cart);
    } catch (error) {
      if (error instanceof Error && /404/.test(error.message)) {
        return null;
      }
      throw error;
    }
  }

  return getMockBasket(id);
};

export const addBasketItem = async (input: {
  basketId: string;
  productId: string;
  quantity: number;
}): Promise<Basket> => {
  if (COMMERCETOOLS_ENABLED) {
    const cart = await commercetoolsFetch<CTCart>(`/carts/${input.basketId}`);
    const updated = await commercetoolsFetch<CTCart>(`/carts/${input.basketId}`, {
      method: "POST",
      body: JSON.stringify({
        version: cart.version,
        actions: [
          {
            action: "addLineItem",
            productId: input.productId,
            quantity: input.quantity,
          },
        ],
      }),
    });

    return mapCart(updated);
  }

  const basket = getMockBasket(input.basketId);
  if (!basket) throw new Error(`Unknown basket: ${input.basketId}`);

  const product = mockProducts.find((entry) => entry.id === input.productId);
  if (!product) throw new Error(`Unknown product: ${input.productId}`);

  const existing = basket.items.find((item) => item.productId === input.productId);
  if (existing) {
    existing.quantity += input.quantity;
  } else {
    basket.items.push({
      productId: input.productId,
      quantity: input.quantity,
      price: product.price,
    });
  }

  basket.total = calculateTotal(basket.items);
  basket.updatedAt = new Date().toISOString();
  baskets.set(basket.id, basket);
  return basket;
};

export const updateBasketItem = async (input: {
  basketId: string;
  productId: string;
  quantity: number;
}): Promise<Basket> => {
  if (COMMERCETOOLS_ENABLED) {
    const cart = await commercetoolsFetch<CTCart>(`/carts/${input.basketId}`);
    const lineItem = cart.lineItems.find(
      (item) => item.productId === input.productId
    );

    if (!lineItem) {
      throw new Error(`Unknown product in basket: ${input.productId}`);
    }

    const actions =
      input.quantity <= 0
        ? [{ action: "removeLineItem", lineItemId: lineItem.id }]
        : [
            {
              action: "changeLineItemQuantity",
              lineItemId: lineItem.id,
              quantity: input.quantity,
            },
          ];

    const updated = await commercetoolsFetch<CTCart>(`/carts/${input.basketId}`, {
      method: "POST",
      body: JSON.stringify({
        version: cart.version,
        actions,
      }),
    });

    return mapCart(updated);
  }

  const basket = getMockBasket(input.basketId);
  if (!basket) throw new Error(`Unknown basket: ${input.basketId}`);

  const index = basket.items.findIndex(
    (item) => item.productId === input.productId
  );

  if (index === -1) {
    throw new Error(`Unknown product in basket: ${input.productId}`);
  }

  if (input.quantity <= 0) {
    basket.items.splice(index, 1);
  } else {
    basket.items[index] = {
      ...basket.items[index],
      quantity: input.quantity,
    };
  }

  basket.total = calculateTotal(basket.items);
  basket.updatedAt = new Date().toISOString();
  baskets.set(basket.id, basket);
  return basket;
};

export const removeBasketItem = async (input: {
  basketId: string;
  productId: string;
}): Promise<Basket> => {
  return updateBasketItem({
    basketId: input.basketId,
    productId: input.productId,
    quantity: 0,
  });
};
