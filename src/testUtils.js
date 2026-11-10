import { vi } from "vitest";

export const products = [
  {
    id: 1,
    title: "Backpack",
    price: 10,
    description: "A bag",
    category: "bags",
    image: "https://example.com/backpack.jpg",
  },
  {
    id: 2,
    title: "Shirt",
    price: 20,
    description: "A shirt",
    category: "clothes",
    image: "https://example.com/shirt.jpg",
  },
];

export const okResponse = () => ({ ok: true, json: async () => products });

export function stubFetchWith(implementation) {
  const fetchMock = vi.fn(implementation);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}
