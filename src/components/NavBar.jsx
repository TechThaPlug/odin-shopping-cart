import { NavLink } from "react-router";

function NavBar({ cartCount }) {
  return (
    <header className="navbar">
      <nav aria-label="Main">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/shop">Shop</NavLink>
        <NavLink to="/cart">
          {cartCount > 0 ? "Cart (" + cartCount + ")" : "Cart"}
        </NavLink>
      </nav>
    </header>
  );
}

export default NavBar;
