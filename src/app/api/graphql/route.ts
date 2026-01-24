import { createYoga } from "graphql-yoga";
import { schema } from "@/lib/graphql/schema";

const yoga = createYoga({
  graphqlEndpoint: "/api/graphql",
  schema,
  fetchAPI: { Response, Request },
});

export const GET = yoga;
export const POST = yoga;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
