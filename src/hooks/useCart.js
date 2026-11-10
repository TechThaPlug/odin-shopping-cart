import { useCallback, useState } from "react";
import { MAX_QUANTITY } from "../utils/quantity.js";

export function useCart() {
  const [items, setItems] = useState([]);

  const addToCart = useCallback((product, quantity) => {
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id);

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Math.min(MAX_QUANTITY, item.quantity + quantity),
              }
            : item,
        );
      }

      return [
        ...current,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: Math.min(MAX_QUANTITY, quantity),
        },
      ];
    });
  }, []);

  const setQuantity = useCallback((id, quantity) => {
    setItems((current) =>
      quantity < 1
        ? current.filter((item) => item.id !== id)
        : current.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.min(MAX_QUANTITY, quantity) }
              : item,
          ),
    );
  }, []);

  const removeItem = useCallback((id) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  // Derived values: calculated from items, never stored in state
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalCents = items.reduce(
    (sum, item) => sum + Math.round(item.price * 100) * item.quantity,
    0,
  );

  return {
    items,
    addToCart,
    setQuantity,
    removeItem,
    totalItems,
    totalPrice: totalCents / 100,
  };
}
