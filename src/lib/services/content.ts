import { getContentfulPage } from "@/lib/services/contentful";
import type { ContentPage } from "@/lib/types";

export const getContentPage = async (slug: string): Promise<ContentPage | null> => {
  return getContentfulPage(slug);
};
