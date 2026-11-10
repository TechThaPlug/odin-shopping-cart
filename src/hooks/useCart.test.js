import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCart } from "./useCart.js";

const backpack = { id: 1, title: "Backpack", price: 10.5, image: "a.jpg" };
const shirt = { id: 2, title: "Shirt", price: 20, image: "b.jpg" };

describe("useCart", () => {
  it("starts empty", () => {
    const { result } = renderHook(() => useCart());

    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it("adds a new product with a quantity", () => {
    const { result } = renderHook(() => useCart());

    act(() => result.current.addToCart(backpack, 2));

    expect(result.current.items).toEqual([{ ...backpack, quantity: 2 }]);
    expect(result.current.totalItems).toBe(2);
    expect(result.current.totalPrice).toBe(21);
  });

  it("adds to an existing product instead of duplicating it", () => {
    const { result } = renderHook(() => useCart());

    act(() => result.current.addToCart(backpack, 2));
    act(() => result.current.addToCart(backpack, 3));

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(5);
  });

  it("never lets a quantity pass 99", () => {
    const { result } = renderHook(() => useCart());

    act(() => result.current.addToCart(backpack, 98));
    act(() => result.current.addToCart(backpack, 5));

    expect(result.current.items[0].quantity).toBe(99);
  });

  it("sets a quantity", () => {
    const { result } = renderHook(() => useCart());

    act(() => result.current.addToCart(backpack, 1));
    act(() => result.current.setQuantity(1, 7));

    expect(result.current.items[0].quantity).toBe(7);
  });

  it("removes an item when its quantity is set below 1", () => {
    const { result } = renderHook(() => useCart());

    act(() => result.current.addToCart(backpack, 1));
    act(() => result.current.setQuantity(1, 0));

    expect(result.current.items).toEqual([]);
  });

  it("removes only the chosen item", () => {
    const { result } = renderHook(() => useCart());

    act(() => result.current.addToCart(backpack, 1));
    act(() => result.current.addToCart(shirt, 1));
    act(() => result.current.removeItem(1));

    expect(result.current.items.map((item) => item.id)).toEqual([2]);
  });

  it("adds up several products", () => {
    const { result } = renderHook(() => useCart());

    act(() => result.current.addToCart(backpack, 2));
    act(() => result.current.addToCart(shirt, 1));

    expect(result.current.totalItems).toBe(3);
    expect(result.current.totalPrice).toBe(41);
  });

  it("avoids floating point errors in the total", () => {
    const { result } = renderHook(() => useCart());

    act(() => result.current.addToCart({ id: 9, title: "Pen", price: 0.1 }, 3));

    expect(result.current.totalPrice).toBe(0.3);
  });
});
