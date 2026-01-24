/** @vitest-environment jsdom */
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductCard } from "@/components/ProductCard";
import { mockProducts } from "@/lib/data/mock-data";

describe("ProductCard", () => {
  it("renders product details", () => {
    render(<ProductCard product={mockProducts[0]} />);

    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      mockProducts[0].name
    );
    expect(screen.getByText(/add to bag/i)).toBeInTheDocument();
    expect(screen.getByText(/left/i)).toHaveTextContent(
      `${mockProducts[0].inventory} left`
    );
  });
});
