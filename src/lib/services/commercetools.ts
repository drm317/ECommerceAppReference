import {
  COMMERCETOOLS_API_URL,
  COMMERCETOOLS_AUTH_URL,
  COMMERCETOOLS_CLIENT_ID,
  COMMERCETOOLS_CLIENT_SECRET,
  COMMERCETOOLS_PROJECT_KEY,
  COMMERCETOOLS_SCOPES,
  COMMERCETOOLS_ENABLED,
} from "@/lib/config/env";

type AccessToken = { value: string; expiresAt: number };

let cachedToken: AccessToken | null = null;

const getAccessToken = async (): Promise<string> => {
  if (!COMMERCETOOLS_ENABLED) {
    throw new Error("CommerceTools credentials are not configured.");
  }

  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 30_000) {
    return cachedToken.value;
  }

  const credentials = Buffer.from(
    `${COMMERCETOOLS_CLIENT_ID}:${COMMERCETOOLS_CLIENT_SECRET}`
  ).toString("base64");

  const body = new URLSearchParams({
    grant_type: "client_credentials",
  });

  if (COMMERCETOOLS_SCOPES) {
    body.set("scope", COMMERCETOOLS_SCOPES);
  }

  const response = await fetch(`${COMMERCETOOLS_AUTH_URL}/oauth/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`CommerceTools auth failed: ${response.status} ${errorText}`);
  }

  const payload = (await response.json()) as {
    access_token: string;
    expires_in: number;
  };

  cachedToken = {
    value: payload.access_token,
    expiresAt: now + payload.expires_in * 1000,
  };

  return payload.access_token;
};

export const commercetoolsFetch = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = await getAccessToken();
  const response = await fetch(
    `${COMMERCETOOLS_API_URL}/${COMMERCETOOLS_PROJECT_KEY}${path}`,
    {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`CommerceTools request failed: ${response.status} ${errorText}`);
  }

  return (await response.json()) as T;
};
