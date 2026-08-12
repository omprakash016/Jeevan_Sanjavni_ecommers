import Container from "../ui/Container";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import logo from "../../assets/logo/logo.jpeg";
import "./Navbar.css";

import { logoutUser } from "../../services/authService";
import { logout } from "../../redux/auth/authSlice";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();

      dispatch(logout());

      closeMenu();

      toast.success("Logged out successfully");

      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Logout failed. Please try again."
      );
    }
  };

  return (
    <header className="navbar">
      <Container>

        <div className="navbar-container">

          {/* Logo */}

          <Link
            to="/"
            className="logo"
            onClick={closeMenu}
          >
            <img
              src={logo}
              alt="Jeevan Sanjivani"
            />

            <h2>
              Jeevan <span>Sanjivani</span>
            </h2>
          </Link>


          {/* Navigation */}

          <nav
            className={
              menuOpen
                ? "nav-menu active"
                : "nav-menu"
            }
          >

            <Link
              to="/"
              onClick={closeMenu}
            >
              Home
            </Link>

            <Link
              to="/#services"
              onClick={closeMenu}
            >
              Services
            </Link>

            <Link
              to="/#doctors"
              onClick={closeMenu}
            >
              Doctors
            </Link>

            <Link
              to="/#about"
              onClick={closeMenu}
            >
              About
            </Link>

            <Link
              to="/products"
              onClick={closeMenu}
            >
              Products
            </Link>

            <Link
              to="/#contact"
              onClick={closeMenu}
            >
              Contact
            </Link>


            {/* Logged Out */}

            {!isAuthenticated && (
              <>
                <Link
                  to="/register"
                  className="register-btn"
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </>
            )}


            {/* Customer */}

            {isAuthenticated &&
              user?.role === "customer" && (
                <>
                  <Link
                    to="/cart"
                    onClick={closeMenu}
                  >
                    Cart
                  </Link>

                  <Link
                    to="/profile"
                    onClick={closeMenu}
                  >
                    Profile
                  </Link>

                  <button
                    type="button"
                    className="logout-btn"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              )}


            {/* Admin */}

            {isAuthenticated &&
              user?.role === "admin" && (
                <>
                  <Link
                    to="/admin"
                    className="admin-btn"
                    onClick={closeMenu}
                  >
                    Admin Dashboard
                  </Link>

                  <button
                    type="button"
                    className="logout-btn"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              )}

          </nav>


          {/* Right Side */}

          <div className="nav-right">

            {/* Mobile Menu Button */}

            <button
              type="button"
              className="menu-btn"
              onClick={() =>
                setMenuOpen((prev) => !prev)
              }
              aria-label="Toggle navigation"
            >
              {menuOpen ? (
                <X size={28} />
              ) : (
                <Menu size={28} />
              )}
            </button>

          </div>

        </div>

      </Container>
    </header>
  );
};

export default Navbar;