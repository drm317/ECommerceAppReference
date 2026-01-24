export const DEV_MODE =
  process.env.DEV_MODE === "true" || process.env.NODE_ENV !== "production";

export const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID ?? "";
export const ALGOLIA_API_KEY = process.env.ALGOLIA_API_KEY ?? "";
export const ALGOLIA_INDEX_PRODUCTS =
  process.env.ALGOLIA_INDEX_PRODUCTS ?? "products";

export const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID ?? "";
export const CONTENTFUL_ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN ?? "";
export const CONTENTFUL_ENVIRONMENT =
  process.env.CONTENTFUL_ENVIRONMENT ?? "master";
