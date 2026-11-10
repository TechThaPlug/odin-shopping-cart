import { useState } from "react";
import QuantityInput from "./QuantityInput.jsx";
import { formatPrice } from "../utils/formatPrice.js";
import { parseQuantity } from "../utils/quantity.js";

function CartItem({ item, onSetQuantity, onRemove }) {
  const [text, setText] = useState(String(item.quantity));

  const subtotal = (Math.round(item.price * 100) * item.quantity) / 100;

  function handleChange(next) {
    setText(next);

    const parsed = parseQuantity(next);
    if (parsed !== null) {
      onSetQuantity(item.id, parsed);
    }
  }

  function handleBlur() {
    if (parseQuantity(text) === null) {
      setText(String(item.quantity));
    }
  }

  return (
    <article className="cart-item">
      <img src={item.image} alt="" width="72" height="72" />

      <div>
        <h3>{item.title}</h3>
        <p className="muted">{formatPrice(item.price)} each</p>
      </div>

      <div className="cart-controls">
        <QuantityInput
          label={item.title}
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <p className="subtotal">{formatPrice(subtotal)}</p>
        <button
          type="button"
          className="remove"
          aria-label={"Remove " + item.title + " from cart"}
          onClick={() => onRemove(item.id)}
        >
          Remove
        </button>
      </div>
    </article>
  );
}

export default CartItem;
