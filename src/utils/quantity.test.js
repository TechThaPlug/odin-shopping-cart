import { describe, it, expect } from "vitest";
import { parseQuantity, stepQuantity } from "./quantity.js";

describe("parseQuantity", () => {
  it("accepts whole numbers from 1 to 99", () => {
    expect(parseQuantity("1")).toBe(1);
    expect(parseQuantity("99")).toBe(99);
    expect(parseQuantity(" 7 ")).toBe(7);
  });

  it("rejects everything else", () => {
    expect(parseQuantity("")).toBeNull();
    expect(parseQuantity("0")).toBeNull();
    expect(parseQuantity("100")).toBeNull();
    expect(parseQuantity("-3")).toBeNull();
    expect(parseQuantity("2.5")).toBeNull();
    expect(parseQuantity("abc")).toBeNull();
  });
});

describe("stepQuantity", () => {
  it("adds and subtracts one", () => {
    expect(stepQuantity("5", 1)).toBe("6");
    expect(stepQuantity("5", -1)).toBe("4");
  });

  it("stays within the limits", () => {
    expect(stepQuantity("1", -1)).toBe("1");
    expect(stepQuantity("99", 1)).toBe("99");
  });

  it("restarts at 1 when the text is not a valid quantity", () => {
    expect(stepQuantity("", 1)).toBe("1");
    expect(stepQuantity("abc", -1)).toBe("1");
  });
});
