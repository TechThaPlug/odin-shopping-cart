import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import NavBar from "./NavBar.jsx";

function renderNav(cartCount) {
  render(
    <MemoryRouter>
      <NavBar cartCount={cartCount} />
    </MemoryRouter>,
  );
}

describe("NavBar", () => {
  it("shows the three pages", () => {
    renderNav(0);

    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Shop" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Cart" })).toBeInTheDocument();
  });

  it("shows no count when the cart is empty", () => {
    renderNav(0);

    expect(screen.getByRole("link", { name: "Cart" })).toBeInTheDocument();
    expect(screen.queryByText(/\(\d+\)/)).not.toBeInTheDocument();
  });

  it("shows the number of items in the cart", () => {
    renderNav(3);

    expect(screen.getByRole("link", { name: "Cart (3)" })).toBeInTheDocument();
  });
});
