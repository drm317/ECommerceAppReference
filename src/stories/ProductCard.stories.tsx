import type { Meta, StoryObj } from "@storybook/react";
import { ProductCard } from "@/components/ProductCard";
import { mockProducts } from "@/lib/data/mock-data";

const meta: Meta<typeof ProductCard> = {
  title: "Storefront/ProductCard",
  component: ProductCard,
};

export default meta;

type Story = StoryObj<typeof ProductCard>;

export const Default: Story = {
  args: {
    product: mockProducts[0],
  },
};
