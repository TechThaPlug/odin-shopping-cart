import { useState } from "react";
import QuantityInput from "./QuantityInput.jsx";
import { formatPrice } from "../utils/formatPrice.js";
import { parseQuantity } from "../utils/quantity.js";

function ProductCard({ product, onAdd }) {
  const [quantity, setQuantity] = useState("1");
  const [message, setMessage] = useState("");

  const parsed = parseQuantity(quantity);

  function handleChange(next) {
    setQuantity(next);
    setMessage("");
  }

  function handleBlur() {
    if (parsed === null) {
      setQuantity("1");
    }
  }

  function handleAdd() {
    if (parsed === null) {
      return;
    }

    onAdd(product, parsed);
    setQuantity("1");
    setMessage("Added " + parsed + " to cart");
  }

  return (
    <article className="product-card">
      <img src={product.image} alt="" loading="lazy" />
      <h3>{product.title}</h3>
      <p className="price">{formatPrice(product.price)}</p>

      <QuantityInput
        label={product.title}
        value={quantity}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <button type="button" onClick={handleAdd} disabled={parsed === null}>
        Add to cart
      </button>
      <p role="status" className="added">
        {message}
      </p>
    </article>
  );
}

export default ProductCard;
