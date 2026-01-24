import styles from "@/components/product-grid.module.css";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";

export type ProductGridProps = {
  products: Product[];
};

export const ProductGrid = ({ products }: ProductGridProps) => {
  return (
    <section className={styles.grid}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
};
