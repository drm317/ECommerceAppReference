import styles from "@/components/order-summary.module.css";
import type { Order, Product } from "@/lib/types";

export type OrderSummaryProps = {
  order: Order;
  products: Product[];
};

export const OrderSummary = ({ order, products }: OrderSummaryProps) => {
  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Order {order.id}</p>
          <h3>{order.status.toUpperCase()}</h3>
        </div>
        <span className={styles.total}>${order.total}</span>
      </header>
      <ul className={styles.list}>
        {order.items.map((item) => {
          const product = products.find((entry) => entry.id === item.productId);
          return (
            <li key={item.productId} className={styles.listItem}>
              <span>{product?.name ?? item.productId}</span>
              <span>
                {item.quantity} × ${item.price}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
