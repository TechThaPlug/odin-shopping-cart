import { Link, useOutletContext } from "react-router";
import CartItem from "../components/CartItem.jsx";
import { formatPrice } from "../utils/formatPrice.js";

function Cart() {
  const { items, setQuantity, removeItem, totalItems, totalPrice } =
    useOutletContext();

  if (items.length === 0) {
    return (
      <section>
        <h1>Your cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/shop">Browse the shop</Link>
      </section>
    );
  }

  return (
    <section>
      <h1>Your cart</h1>

      <ul className="cart-list">
        {items.map((item) => (
          <li key={item.id}>
            <CartItem
              item={item}
              onSetQuantity={setQuantity}
              onRemove={removeItem}
            />
          </li>
        ))}
      </ul>

      <div className="cart-summary">
        <p>
          {totalItems} {totalItems === 1 ? "item" : "items"}
        </p>
        <p className="total">
          Total: <strong>{formatPrice(totalPrice)}</strong>
        </p>
        <p className="muted">This is a demo, so there is no checkout.</p>
      </div>
    </section>
  );
}

export default Cart;
