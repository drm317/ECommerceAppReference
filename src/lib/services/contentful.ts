import {
  CONTENTFUL_ACCESS_TOKEN,
  CONTENTFUL_ENVIRONMENT,
  CONTENTFUL_SPACE_ID,
  DEV_MODE,
} from "@/lib/config/env";
import { mockContent } from "@/lib/data/mock-data";
import type { ContentPage } from "@/lib/types";

const baseUrl = `https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENVIRONMENT}`;

export const getContentfulPage = async (
  slug: string
): Promise<ContentPage | null> => {
  if (DEV_MODE) {
    return slug === mockContent.slug ? mockContent : null;
  }

  if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
    throw new Error("Contentful credentials are missing.");
  }

  const url = new URL(`${baseUrl}/entries`);
  url.searchParams.set("content_type", "page");
  url.searchParams.set("fields.slug", slug);

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${CONTENTFUL_ACCESS_TOKEN}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Contentful fetch failed: ${response.status}`);
  }

  const payload = (await response.json()) as {
    items: Array<{
      sys: { id: string };
      fields: {
        slug: string;
        title: string;
        blocks?: Array<{
          sys: { id: string };
          fields: {
            type: string;
            title: string;
            body?: string;
            image?: { fields?: { file?: { url?: string } } };
          };
        }>;
      };
    }>;
  };

  const entry = payload.items[0];
  if (!entry) return null;

  return {
    id: entry.sys.id,
    slug: entry.fields.slug,
    title: entry.fields.title,
    blocks:
      entry.fields.blocks?.map((block) => ({
        id: block.sys.id,
        type: (block.fields.type ?? "text") as ContentPage["blocks"][number]["type"],
        title: block.fields.title,
        body: block.fields.body ?? null,
        imageUrl: block.fields.image?.fields?.file?.url
          ? `https:${block.fields.image.fields.file.url}`
          : null,
      })) ?? [],
  };
};
