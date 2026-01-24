import type { Meta, StoryObj } from "@storybook/react";
import { OrderSummary } from "@/components/OrderSummary";
import { mockOrders, mockProducts } from "@/lib/data/mock-data";

const meta: Meta<typeof OrderSummary> = {
  title: "Storefront/OrderSummary",
  component: OrderSummary,
};

export default meta;

type Story = StoryObj<typeof OrderSummary>;

export const Default: Story = {
  args: {
    order: mockOrders[0],
    products: mockProducts,
  },
};
