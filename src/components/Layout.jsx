import { Outlet } from "react-router";
import NavBar from "./NavBar.jsx";
import { useCart } from "../hooks/useCart.js";

function Layout() {
  const cart = useCart();

  return (
    <>
      <NavBar cartCount={cart.totalItems} />
      <main className="page">
        <Outlet context={cart} />
      </main>
    </>
  );
}

export default Layout;
