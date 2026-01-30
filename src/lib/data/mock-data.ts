import type { ContentPage, Order, Product, Basket, Payment } from "@/lib/types";

export const mockProducts: Product[] = [
  {
    id: "pr_aurora_sneaker",
    name: "Aurora Knit Runner",
    description:
      "A featherlight runner with adaptive knit and a split-foam midsole built for city pace.",
    price: 148,
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    tags: ["new", "running", "city"],
    inventory: 42,
    status: "active",
  },
  {
    id: "pr_atlas_jacket",
    name: "Atlas Weather Shell",
    description:
      "Three-layer storm shell with a matte finish, bonded seams, and magnet stow pockets.",
    price: 265,
    imageUrl:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    tags: ["outerwear", "weatherproof"],
    inventory: 18,
    status: "active",
  },
  {
    id: "pr_orbit_pack",
    name: "Orbit Modular Pack",
    description:
      "A 22L carry with detachable tech pouch and anti-splash coating for daily commutes.",
    price: 132,
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    tags: ["carry", "modular"],
    inventory: 55,
    status: "active",
  },
  {
    id: "pr_lumen_lamp",
    name: "Lumen Desk Lamp",
    description:
      "Warm spectrum LED lamp with touch dimming and a recharged aluminum base.",
    price: 92,
    imageUrl:
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=80",
    tags: ["home", "lighting"],
    inventory: 12,
    status: "active",
  },
];

export const mockContent: ContentPage = {
  id: "home",
  slug: "home",
  title: "Surface & Co.",
  blocks: [
    {
      id: "hero-1",
      type: "hero",
      title: "Everyday gear for a sharper city rhythm.",
      body:
        "Limited-run drops, climate-ready materials, and modular design for whatever the day turns into.",
      imageUrl:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
    },
    {
      id: "feature-1",
      type: "feature",
      title: "Made for motion",
      body:
        "Adaptive textiles and breathable layers keep your pace smooth across every surface.",
      imageUrl:
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "feature-2",
      type: "feature",
      title: "Precision storage",
      body:
        "Modular pockets and magnetic closures make carry simple and quiet.",
      imageUrl:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    },
  ],
};

export const mockOrders: Order[] = [
  {
    id: "ord_1001",
    items: [
      { productId: "pr_aurora_sneaker", quantity: 1, price: 148 },
      { productId: "pr_lumen_lamp", quantity: 2, price: 92 },
    ],
    total: 332,
    status: "processing",
    email: "studio@example.com",
    createdAt: new Date().toISOString(),
  },
];

export const mockBaskets: Basket[] = [
  {
    id: "cart_2001",
    items: [{ productId: "pr_atlas_jacket", quantity: 1, price: 265 }],
    total: 265,
    currency: "USD",
    country: "US",
    status: "active",
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const mockPayments: Payment[] = [
  {
    id: "pay_3001",
    amount: 265,
    currency: "USD",
    status: "pending",
    orderId: "ord_1001",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
