import type { Meta, StoryObj } from "@storybook/react";
import { Hero } from "@/components/Hero";
import { mockContent } from "@/lib/data/mock-data";

const heroBlock = mockContent.blocks.find((block) => block.type === "hero");

const meta: Meta<typeof Hero> = {
  title: "Storefront/Hero",
  component: Hero,
};

export default meta;

type Story = StoryObj<typeof Hero>;

export const Default: Story = {
  args: {
    title: heroBlock?.title ?? "Everyday gear for a sharper city rhythm.",
    description:
      heroBlock?.body ?? "Limited-run drops, climate-ready materials, and modular design.",
    imageUrl: heroBlock?.imageUrl,
    eyebrow: "Spring capsule",
  },
};
