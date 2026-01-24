export type GraphQLResponse<T> = { data?: T; errors?: Array<{ message: string }> };

const resolveBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
};

export const fetchGraphQL = async <T>(query: string, variables?: Record<string, unknown>) => {
  const response = await fetch(`${resolveBaseUrl()}/api/graphql`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.status}`);
  }

  const payload = (await response.json()) as GraphQLResponse<T>;
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((err) => err.message).join(" | "));
  }

  return payload.data as T;
};
