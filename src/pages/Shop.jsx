import { useOutletContext } from "react-router";
import ProductCard from "../components/ProductCard.jsx";
import { useFetch } from "../hooks/useFetch.js";

const PRODUCTS_URL = "https://fakestoreapi.com/products";

function Shop() {
  const { addToCart } = useOutletContext();
  const { data: products, error, loading, retry } = useFetch(PRODUCTS_URL);

  return (
    <section>
      <h1>Shop</h1>

      {loading && <p className="message">Loading products...</p>}

      {error && (
        <div role="alert" className="message">
          <p>Could not load products: {error.message}</p>
          <button type="button" onClick={retry}>
            Try again
          </button>
        </div>
      )}

      {products && (
        <ul className="product-grid">
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} onAdd={addToCart} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default Shop;
