import styles from "@/app/page.module.css";
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { OrderSummary } from "@/components/OrderSummary";
import { fetchGraphQL } from "@/lib/graphql/client";
import type { ContentPage, Order, Product } from "@/lib/types";

const homeQuery = /* GraphQL */ `
  query Home($slug: String!, $query: String) {
    content(slug: $slug) {
      id
      title
      slug
      blocks {
        id
        type
        title
        body
        imageUrl
      }
    }
    products(query: $query) {
      id
      name
      description
      price
      imageUrl
      tags
      inventory
      status
    }
    orders {
      id
      status
      total
      createdAt
      items {
        productId
        quantity
        price
      }
    }
  }
`;

const fallbackFeatureImage =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80";

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.q ?? "";
  const data = await fetchGraphQL<{
    content: ContentPage | null;
    products: Product[];
    orders: Order[];
  }>(homeQuery, { slug: "home", query: query || null });

  const heroBlock = data.content?.blocks.find((block) => block.type === "hero");
  const features = data.content?.blocks.filter((block) => block.type === "feature") ?? [];

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <Hero
          title={heroBlock?.title ?? "New drops for the everyday rush"}
          description={
            heroBlock?.body ??
            "Utility essentials engineered for the street, the studio, and the long commute home."
          }
          imageUrl={heroBlock?.imageUrl}
          eyebrow="Spring capsule"
        />

        <section className={styles.section}>
          <header className={styles.sectionHeader}>
            <div>
              <p className={styles.kicker}>Products</p>
              <h2>Latest arrivals</h2>
            </div>
            <p className={styles.muted}>
              Powered by Algolia search. In dev mode, products are mocked locally.
            </p>
          </header>
          <form className={styles.search} role="search">
            <input
              type="search"
              name="q"
              placeholder="Search products, tags, or descriptions"
              defaultValue={query}
              aria-label="Search products"
            />
            <button type="submit">Search</button>
          </form>
          <ProductGrid products={data.products} />
        </section>

        <section className={styles.sectionAlt}>
          <header className={styles.sectionHeader}>
            <div>
              <p className={styles.kicker}>Story</p>
              <h2>Contentful editorial blocks</h2>
            </div>
            <p className={styles.muted}>
              Content blocks are loaded from Contentful when configured, or fall back
              to local content in dev mode.
            </p>
          </header>
          <div className={styles.featureGrid}>
            {features.map((block) => (
              <article key={block.id} className={styles.featureCard}>
                <img src={block.imageUrl ?? fallbackFeatureImage} alt={block.title} />
                <div>
                  <h3>{block.title}</h3>
                  <p>{block.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <header className={styles.sectionHeader}>
            <div>
              <p className={styles.kicker}>Orders</p>
              <h2>Recent orders</h2>
            </div>
            <p className={styles.muted}>
              Order data is handled by the backend order service.
            </p>
          </header>
          <div className={styles.orderGrid}>
            {data.orders.map((order) => (
              <OrderSummary key={order.id} order={order} products={data.products} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
