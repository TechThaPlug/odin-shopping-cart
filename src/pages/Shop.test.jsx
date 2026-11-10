import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, Outlet, RouterProvider } from "react-router";
import Shop from "./Shop.jsx";
import { okResponse, products, stubFetchWith } from "../testUtils.js";

function renderShop() {
  const addToCart = vi.fn();

  const router = createMemoryRouter([
    {
      path: "/",
      element: <Outlet context={{ addToCart }} />,
      children: [{ index: true, element: <Shop /> }],
    },
  ]);

  render(<RouterProvider router={router} />);
  return addToCart;
}

describe("Shop page", () => {
  it("shows a loading message, then the products", async () => {
    stubFetchWith(async () => okResponse());
    renderShop();

    expect(screen.getByText("Loading products...")).toBeInTheDocument();
    expect(
      await screen.findByRole("heading", { name: "Backpack" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Shirt" })).toBeInTheDocument();
    expect(screen.queryByText("Loading products...")).not.toBeInTheDocument();
  });

  it("requests the products from FakeStore", async () => {
    const fetchMock = stubFetchWith(async () => okResponse());
    renderShop();

    await screen.findByRole("heading", { name: "Backpack" });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://fakestoreapi.com/products",
      expect.anything(),
    );
  });

  it("passes the chosen product and quantity to addToCart", async () => {
    const user = userEvent.setup();
    stubFetchWith(async () => okResponse());
    const addToCart = renderShop();

    const [addFirst] = await screen.findAllByRole("button", {
      name: "Add to cart",
    });
    await user.click(addFirst);

    expect(addToCart).toHaveBeenCalledWith(products[0], 1);
  });

  it("shows an error when the server replies with a failure", async () => {
    stubFetchWith(async () => ({ ok: false, status: 500 }));
    renderShop();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Server error: 500",
    );
  });

  it("shows an error when the network fails", async () => {
    stubFetchWith(async () => {
      throw new Error("Failed to fetch");
    });
    renderShop();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Failed to fetch",
    );
  });

  it("lets the user try again after an error", async () => {
    const user = userEvent.setup();
    let calls = 0;
    stubFetchWith(async () => {
      calls++;
      if (calls === 1) {
        throw new Error("offline");
      }
      return okResponse();
    });
    renderShop();

    await user.click(await screen.findByRole("button", { name: "Try again" }));

    expect(
      await screen.findByRole("heading", { name: "Backpack" }),
    ).toBeInTheDocument();
  });
});
