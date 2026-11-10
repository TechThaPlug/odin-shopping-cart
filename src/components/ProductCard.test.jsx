import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductCard from "./ProductCard.jsx";

const product = { id: 1, title: "Backpack", price: 10, image: "a.jpg" };

function setup() {
  const onAdd = vi.fn();
  const user = userEvent.setup();
  render(<ProductCard product={product} onAdd={onAdd} />);

  return {
    onAdd,
    user,
    input: screen.getByRole("spinbutton", { name: "Quantity for Backpack" }),
    addButton: screen.getByRole("button", { name: "Add to cart" }),
  };
}

describe("ProductCard", () => {
  it("shows the title and the price", () => {
    setup();

    expect(
      screen.getByRole("heading", { name: "Backpack" }),
    ).toBeInTheDocument();
    expect(screen.getByText("$10.00")).toBeInTheDocument();
  });

  it("adds one by default", async () => {
    const { onAdd, user, addButton } = setup();

    await user.click(addButton);

    expect(onAdd).toHaveBeenCalledWith(product, 1);
  });

  it("adds the typed quantity", async () => {
    const { onAdd, user, input, addButton } = setup();

    await user.clear(input);
    await user.type(input, "4");
    await user.click(addButton);

    expect(onAdd).toHaveBeenCalledWith(product, 4);
  });

  it("increments with the plus button", async () => {
    const { user, input } = setup();

    await user.click(
      screen.getByRole("button", { name: "Increase quantity for Backpack" }),
    );

    expect(input).toHaveValue(2);
  });

  it("does not decrement below 1", async () => {
    const { user, input } = setup();

    await user.click(
      screen.getByRole("button", { name: "Decrease quantity for Backpack" }),
    );

    expect(input).toHaveValue(1);
  });

  it("disables adding when the box is empty", async () => {
    const { user, input, addButton } = setup();

    await user.clear(input);

    expect(addButton).toBeDisabled();
  });

  it("disables adding when the quantity is above 99", async () => {
    const { user, input, addButton } = setup();

    await user.clear(input);
    await user.type(input, "150");

    expect(addButton).toBeDisabled();
  });

  it("resets to 1 and confirms after adding", async () => {
    const { user, input, addButton } = setup();

    await user.clear(input);
    await user.type(input, "3");
    await user.click(addButton);

    expect(input).toHaveValue(1);
    expect(screen.getByRole("status")).toHaveTextContent("Added 3 to cart");
  });

  it("resets an empty box to 1 when the user leaves it", async () => {
    const { user, input } = setup();

    await user.clear(input);
    await user.tab();

    expect(input).toHaveValue(1);
  });
});
