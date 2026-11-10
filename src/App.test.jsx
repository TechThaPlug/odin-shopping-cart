import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import routes from "./routes.jsx";
import { okResponse, stubFetchWith } from "./testUtils.js";

function renderApp(path = "/") {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(<RouterProvider router={router} />);
}

describe("Shopping cart app", () => {
  it("shows the home page with the main navigation", () => {
    renderApp("/");

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /welcome/i,
    );

    const nav = within(screen.getByRole("navigation", { name: "Main" }));
    expect(nav.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(nav.getByRole("link", { name: "Shop" })).toBeInTheDocument();
    expect(nav.getByRole("link", { name: "Cart" })).toBeInTheDocument();
  });

  it("adds products, updates the navbar count, and edits the cart", async () => {
    const user = userEvent.setup();
    stubFetchWith(async () => okResponse());
    renderApp("/shop");

    const input = await screen.findByRole("spinbutton", {
      name: "Quantity for Backpack",
    });
    await user.clear(input);
    await user.type(input, "2");

    const [addBackpack] = screen.getAllByRole("button", {
      name: "Add to cart",
    });
    await user.click(addBackpack);

    expect(screen.getByRole("link", { name: "Cart (2)" })).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Cart (2)" }));

    expect(
      screen.getByRole("heading", { name: "Your cart" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Backpack" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/^Total:/)).toHaveTextContent("Total: $20.00");

    await user.click(
      screen.getByRole("button", { name: "Increase quantity for Backpack" }),
    );

    expect(screen.getByRole("link", { name: "Cart (3)" })).toBeInTheDocument();
    expect(screen.getByText(/^Total:/)).toHaveTextContent("Total: $30.00");

    await user.click(
      screen.getByRole("button", { name: "Remove Backpack from cart" }),
    );

    expect(screen.getByText("Your cart is empty.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Cart" })).toBeInTheDocument();
  });

  it("keeps the cart when the user moves between pages", async () => {
    const user = userEvent.setup();
    stubFetchWith(async () => okResponse());
    renderApp("/shop");

    const [addFirst] = await screen.findAllByRole("button", {
      name: "Add to cart",
    });
    await user.click(addFirst);
    await user.click(screen.getByRole("link", { name: "Home" }));

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /welcome/i,
    );
    expect(screen.getByRole("link", { name: "Cart (1)" })).toBeInTheDocument();
  });

  it("shows a not-found page, with the navbar, for unknown URLs", () => {
    renderApp("/nope");

    expect(
      screen.getByRole("heading", { name: "Page not found" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Shop" })).toBeInTheDocument();
  });
});
