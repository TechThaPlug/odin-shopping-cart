import { Link } from "react-router";

function ErrorPage() {
  return (
    <section className="hero">
      <h1>Page not found</h1>
      <p>That page doesn't exist, or something went wrong.</p>
      <Link className="cta" to="/">
        Back to the home page
      </Link>
    </section>
  );
}

export default ErrorPage;
