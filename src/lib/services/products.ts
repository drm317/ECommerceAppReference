import { searchAlgoliaProducts, getAlgoliaProduct } from "@/lib/services/algolia";
import type { Product } from "@/lib/types";

export const listProducts = async (query?: string | null): Promise<Product[]> => {
  return searchAlgoliaProducts(query);
};

export const getProductById = async (id: string): Promise<Product | null> => {
  return getAlgoliaProduct(id);
};
