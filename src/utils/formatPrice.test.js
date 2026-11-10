import { describe, it, expect } from "vitest";
import { formatPrice } from "./formatPrice.js";

describe("formatPrice", () => {
  it("formats numbers as US dollars", () => {
    expect(formatPrice(10)).toBe("$10.00");
    expect(formatPrice(109.95)).toBe("$109.95");
    expect(formatPrice(0)).toBe("$0.00");
  });
});
