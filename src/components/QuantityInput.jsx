import { MAX_QUANTITY, MIN_QUANTITY, stepQuantity } from "../utils/quantity.js";

function QuantityInput({ label, value, onChange, onBlur }) {
  return (
    <div className="quantity">
      <button
        type="button"
        aria-label={"Decrease quantity for " + label}
        onClick={() => onChange(stepQuantity(value, -1))}
      >
        -
      </button>
      <input
        type="number"
        aria-label={"Quantity for " + label}
        min={MIN_QUANTITY}
        max={MAX_QUANTITY}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
      />
      <button
        type="button"
        aria-label={"Increase quantity for " + label}
        onClick={() => onChange(stepQuantity(value, 1))}
      >
        +
      </button>
    </div>
  );
}

export default QuantityInput;
