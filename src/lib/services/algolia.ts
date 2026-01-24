import { ALGOLIA_API_KEY, ALGOLIA_APP_ID, ALGOLIA_INDEX_PRODUCTS, DEV_MODE } from "@/lib/config/env";
import { mockProducts } from "@/lib/data/mock-data";
import type { Product } from "@/lib/types";

const algoliaEndpoint = `https://${ALGOLIA_APP_ID}-dsn.algolia.net/1/indexes/${ALGOLIA_INDEX_PRODUCTS}`;

export type AlgoliaSearchResult = {
  hits: Array<{ objectID: string } & Product>;
};

export const searchAlgoliaProducts = async (
  query?: string | null
): Promise<Product[]> => {
  if (DEV_MODE) {
    if (!query) return mockProducts;
    const normalized = query.toLowerCase();
    return mockProducts.filter((product) =>
      `${product.name} ${product.description} ${product.tags.join(" ")}`
        .toLowerCase()
        .includes(normalized)
    );
  }

  if (!ALGOLIA_APP_ID || !ALGOLIA_API_KEY) {
    throw new Error("Algolia credentials are missing.");
  }

  const response = await fetch(`${algoliaEndpoint}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Algolia-API-Key": ALGOLIA_API_KEY,
      "X-Algolia-Application-Id": ALGOLIA_APP_ID,
    },
    body: JSON.stringify({ query: query ?? "" }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Algolia search failed: ${response.status}`);
  }

  const data = (await response.json()) as AlgoliaSearchResult;
  return data.hits.map((hit) => ({ ...hit, id: hit.objectID }));
};

export const getAlgoliaProduct = async (id: string): Promise<Product | null> => {
  if (DEV_MODE) {
    return mockProducts.find((product) => product.id === id) ?? null;
  }

  if (!ALGOLIA_APP_ID || !ALGOLIA_API_KEY) {
    throw new Error("Algolia credentials are missing.");
  }

  const response = await fetch(`${algoliaEndpoint}/${id}`, {
    headers: {
      "Content-Type": "application/json",
      "X-Algolia-API-Key": ALGOLIA_API_KEY,
      "X-Algolia-Application-Id": ALGOLIA_APP_ID,
    },
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Algolia get object failed: ${response.status}`);
  }

  const product = (await response.json()) as Product & { objectID?: string };
  return { ...product, id: product.objectID ?? id };
};
