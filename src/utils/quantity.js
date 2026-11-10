export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 99;

// Turns typed text into a valid whole number, or null if it isn't valid
export function parseQuantity(text) {
  const trimmed = String(text).trim();

  if (!/^\d+$/.test(trimmed)) {
    return null;
  }

  const value = Number(trimmed);
  return value >= MIN_QUANTITY && value <= MAX_QUANTITY ? value : null;
}

// Used by the + and - buttons. Invalid text restarts at the minimum.
export function stepQuantity(text, step) {
  const current = parseQuantity(text);

  if (current === null) {
    return String(MIN_QUANTITY);
  }

  const next = Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, current + step));
  return String(next);
}
