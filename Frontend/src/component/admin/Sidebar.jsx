import "./Sidebar.css";

import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  PlusSquare,
  X,
} from "lucide-react";

import logo from "../../assets/logo/logo.jpeg";

import { logoutUser } from "../../services/authService";
import { logout } from "../../redux/auth/authSlice";

const Sidebar = ({ isOpen, onClose }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {

      await logoutUser();

      dispatch(logout());

      navigate("/");

    } catch (error) {

      console.error(error);

    }
  };


  const handleNavigation = () => {

    if (onClose) {
      onClose();
    }

  };


  return (

    <aside
      className={`sidebar ${isOpen ? "sidebar-open" : ""}`}
    >

      {/* Mobile Close Button */}

      <button
        className="sidebar-close"
        onClick={onClose}
        aria-label="Close sidebar"
      >
        <X size={22} />
      </button>


      {/* Logo */}

      <div className="sidebar-logo">

        <img
          src={logo}
          alt="Jeevan Sanjivani Logo"
        />

        <h2>Admin Panel</h2>

      </div>


      {/* Navigation */}

      <nav className="sidebar-nav">

        <NavLink
          to="/admin"
          end
          onClick={handleNavigation}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>


        <NavLink
          to="/admin/products"
          onClick={handleNavigation}
        >
          <Package size={20} />
          <span>Products</span>
        </NavLink>


        <NavLink
          to="/admin/products/add"
          onClick={handleNavigation}
        >
          <PlusSquare size={20} />
          <span>Add Product</span>
        </NavLink>


        <NavLink
          to="/admin/orders"
          onClick={handleNavigation}
        >
          <ShoppingCart size={20} />
          <span>Orders</span>
        </NavLink>


        <NavLink
          to="/admin/customers"
          onClick={handleNavigation}
        >
          <Users size={20} />
          <span>Customers</span>
        </NavLink>

      </nav>


      {/* Logout */}

      <button
        className="sidebar-logout"
        onClick={handleLogout}
      >

        <LogOut size={20} />

        <span>Logout</span>

      </button>

    </aside>

  );
};

export default Sidebar;