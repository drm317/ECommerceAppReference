import styles from "@/components/product-card.module.css";
import type { Product } from "@/lib/types";

export type ProductCardProps = {
  product: Product;
};

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <img src={product.imageUrl} alt={product.name} />
        <span className={styles.badge}>{product.inventory} left</span>
      </div>
      <div className={styles.body}>
        <p className={styles.kicker}>{product.tags.join(" · ")}</p>
        <h3>{product.name}</h3>
        <p className={styles.description}>{product.description}</p>
        <div className={styles.footer}>
          <span className={styles.price}>${product.price}</span>
          <button type="button">Add to bag</button>
        </div>
      </div>
    </article>
  );
};
