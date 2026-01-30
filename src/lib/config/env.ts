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

export const COMMERCETOOLS_PROJECT_KEY =
  process.env.COMMERCETOOLS_PROJECT_KEY ?? "";
export const COMMERCETOOLS_CLIENT_ID =
  process.env.COMMERCETOOLS_CLIENT_ID ?? "";
export const COMMERCETOOLS_CLIENT_SECRET =
  process.env.COMMERCETOOLS_CLIENT_SECRET ?? "";
export const COMMERCETOOLS_SCOPES = process.env.COMMERCETOOLS_SCOPES ?? "";
export const COMMERCETOOLS_AUTH_URL = process.env.COMMERCETOOLS_AUTH_URL ?? "";
export const COMMERCETOOLS_API_URL = process.env.COMMERCETOOLS_API_URL ?? "";

export const COMMERCETOOLS_ENABLED = Boolean(
  COMMERCETOOLS_PROJECT_KEY &&
    COMMERCETOOLS_CLIENT_ID &&
    COMMERCETOOLS_CLIENT_SECRET &&
    COMMERCETOOLS_AUTH_URL &&
    COMMERCETOOLS_API_URL
);
