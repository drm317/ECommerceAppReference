export type ProductStatus = "active" | "archived" | "draft";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  tags: string[];
  inventory: number;
  status: ProductStatus;
};

export type OrderItem = {
  productId: string;
  quantity: number;
  price: number;
};

export type OrderStatus = "new" | "processing" | "fulfilled";

export type Order = {
  id: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  email?: string | null;
  createdAt: string;
};

export type BasketItem = {
  productId: string;
  quantity: number;
  price: number;
};

export type BasketStatus = "active" | "ordered";

export type Basket = {
  id: string;
  items: BasketItem[];
  total: number;
  currency: string;
  country: string;
  status: BasketStatus;
  version?: number;
  createdAt: string;
  updatedAt: string;
};

export type PaymentStatus = "pending" | "authorized" | "paid" | "failed";

export type Payment = {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  orderId?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ContentBlock = {
  id: string;
  type: "hero" | "feature" | "text" | "cta";
  title: string;
  body?: string | null;
  imageUrl?: string | null;
};

export type ContentPage = {
  id: string;
  slug: string;
  title: string;
  blocks: ContentBlock[];
};
