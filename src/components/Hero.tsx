import styles from "@/components/hero.module.css";

export type HeroProps = {
  title: string;
  description: string;
  imageUrl?: string | null;
  eyebrow?: string;
};

const fallbackImage =
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80";

export const Hero = ({ title, description, imageUrl, eyebrow }: HeroProps) => {
  return (
    <section className={styles.hero}>
      <div className={styles.copy}>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <h1>{title}</h1>
        <p className={styles.description}>{description}</p>
        <div className={styles.actions}>
          <button type="button" className={styles.primary}>
            Shop the drop
          </button>
          <button type="button" className={styles.secondary}>
            Explore stories
          </button>
        </div>
      </div>
      <div className={styles.media}>
        <img src={imageUrl ?? fallbackImage} alt="Collection preview" />
      </div>
    </section>
  );
};
