import type { Meta, StoryObj } from "@storybook/react";
import { ProductGrid } from "@/components/ProductGrid";
import { mockProducts } from "@/lib/data/mock-data";

const meta: Meta<typeof ProductGrid> = {
  title: "Storefront/ProductGrid",
  component: ProductGrid,
};

export default meta;

type Story = StoryObj<typeof ProductGrid>;

export const Default: Story = {
  args: {
    products: mockProducts,
  },
};
