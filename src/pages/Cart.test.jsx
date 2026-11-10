import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, Outlet, RouterProvider } from "react-router";
import Cart from "./Cart.jsx";

const items = [
  { id: 1, title: "Backpack", price: 10, image: "a.jpg", quantity: 2 },
  { id: 2, title: "Shirt", price: 5.5, image: "b.jpg", quantity: 1 },
];

function renderCart(overrides = {}) {
  const cart = {
    items: [],
    setQuantity: vi.fn(),
    removeItem: vi.fn(),
    totalItems: 0,
    totalPrice: 0,
    ...overrides,
  };

  const router = createMemoryRouter([
    {
      path: "/",
      element: <Outlet context={cart} />,
      children: [{ index: true, element: <Cart /> }],
    },
  ]);

  render(<RouterProvider router={router} />);
  return cart;
}

describe("Cart page", () => {
  it("tells the user when the cart is empty", () => {
    renderCart();

    expect(screen.getByText("Your cart is empty.")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Browse the shop" }),
    ).toBeInTheDocument();
  });

  it("lists the items, their subtotals, and the total", () => {
    renderCart({ items, totalItems: 3, totalPrice: 25.5 });

    expect(
      screen.getByRole("heading", { name: "Backpack" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Shirt" })).toBeInTheDocument();
    expect(screen.getByText("$20.00")).toBeInTheDocument();
    expect(screen.getByText("3 items")).toBeInTheDocument();
    expect(screen.getByText(/^Total:/)).toHaveTextContent("Total: $25.50");
  });

  it("uses the singular for one item", () => {
    renderCart({ items: [items[1]], totalItems: 1, totalPrice: 5.5 });

    expect(screen.getByText("1 item")).toBeInTheDocument();
  });

  it("increases a quantity with the plus button", async () => {
    const user = userEvent.setup();
    const cart = renderCart({ items, totalItems: 3, totalPrice: 25.5 });

    await user.click(
      screen.getByRole("button", { name: "Increase quantity for Backpack" }),
    );

    expect(cart.setQuantity).toHaveBeenCalledWith(1, 3);
  });

  it("sets a typed quantity", async () => {
    const user = userEvent.setup();
    const cart = renderCart({ items, totalItems: 3, totalPrice: 25.5 });
    const input = screen.getByRole("spinbutton", {
      name: "Quantity for Backpack",
    });

    await user.clear(input);
    await user.type(input, "7");

    expect(cart.setQuantity).toHaveBeenLastCalledWith(1, 7);
  });

  it("restores the old quantity if the box is left empty", async () => {
    const user = userEvent.setup();
    renderCart({ items, totalItems: 3, totalPrice: 25.5 });
    const input = screen.getByRole("spinbutton", {
      name: "Quantity for Backpack",
    });

    await user.clear(input);
    await user.tab();

    expect(input).toHaveValue(2);
  });

  it("removes an item", async () => {
    const user = userEvent.setup();
    const cart = renderCart({ items, totalItems: 3, totalPrice: 25.5 });

    await user.click(
      screen.getByRole("button", { name: "Remove Backpack from cart" }),
    );

    expect(cart.removeItem).toHaveBeenCalledWith(1);
  });
});
