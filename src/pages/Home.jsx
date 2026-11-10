import { Link } from "react-router";

function Home() {
  return (
    <section className="hero">
      <h1>Welcome to Fake Store</h1>
      <p>
        Browse a pretend catalog, fill a pretend cart, and see how React state,
        routing, and data fetching fit together.
      </p>
      <Link className="cta" to="/shop">
        Start shopping
      </Link>
    </section>
  );
}

export default Home;
