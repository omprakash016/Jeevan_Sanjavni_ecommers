import { Routes, Route } from "react-router-dom";

// ================================
// LAYOUTS
// ================================
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

// ================================
// ROUTE GUARDS
// ================================
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

// ================================
// PUBLIC PAGES
// ================================
import Home from "../pages/Home";
import Products from "../pages/Products";
import ProductDetails from "../pages/ProductDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";

import Services from ".././component/services/Services";
import Doctors from ".././component/doctors/Doctor";
import About from ".././component/about/About";
import Contact from ".././component/contact/Contact";

// ================================
// CUSTOMER PAGES
// ================================
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Profile from "../pages/Profile";
import OrderDetails from "../pages/orderDetails";
import Orders from "../pages/Orders";

// ================================
// ADMIN PAGES
// ================================
import Dashboard from "../pages/admin/Dashboard";
import AdminProducts from "../pages/admin/Products";
import AdminOrders from "../pages/admin/Orders";
import AddProduct from "../pages/admin/AddProduct";
import EditProduct from "../pages/admin/EditProduct";
import AdminProductDetails from "../pages/admin/AdminProductDetails";
import AdminOrderDetails from "../pages/admin/AdminOrderDetails";
import Customers from "../pages/admin/Customer";
import CustomerDetails from "../pages/admin/CustomerDetails";


const AppRoutes = () => {
  return (
    <Routes>

      {/* =====================================================
          PUBLIC ROUTES
      ===================================================== */}

      <Route element={<MainLayout />}>

        {/* Home */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Services */}
        <Route
          path="/services"
          element={<Services />}
        />

        {/* Doctors */}
        <Route
          path="/doctors"
          element={<Doctors />}
        />

        {/* About */}
        <Route
          path="/about"
          element={<About />}
        />

        {/* Products */}
        <Route
          path="/products"
          element={<Products />}
        />

        {/* Product Details */}
        <Route
          path="/products/:slug"
          element={<ProductDetails />}
        />

        {/* Contact */}
        <Route
          path="/contact"
          element={<Contact />}
        />

        {/* Authentication */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

      </Route>


      {/* =====================================================
          CUSTOMER ROUTES
      ===================================================== */}

      <Route element={<PrivateRoute />}>

        <Route element={<MainLayout />}>

          {/* Cart */}
          <Route
            path="/cart"
            element={<Cart />}
          />

          {/* Checkout */}
          <Route
            path="/checkout"
            element={<Checkout />}
          />

          {/* Profile */}
          <Route
            path="/profile"
            element={<Profile />}
          />

          {/* Orders */}
          <Route
            path="/orders"
            element={<Orders />}
          />

          {/* Order Details */}
          <Route
            path="/orders/:id"
            element={<OrderDetails />}
          />

        </Route>

      </Route>


      {/* =====================================================
          ADMIN ROUTES
      ===================================================== */}

      <Route element={<AdminRoute />}>

        <Route
          path="/admin"
          element={<AdminLayout />}
        >

          {/* Dashboard */}
          <Route
            index
            element={<Dashboard />}
          />

          {/* ================= PRODUCTS ================= */}

          <Route
            path="products"
            element={<AdminProducts />}
          />

          <Route
            path="products/add"
            element={<AddProduct />}
          />

          <Route
            path="products/:slug"
            element={<AdminProductDetails />}
          />

          <Route
            path="products/:slug/edit"
            element={<EditProduct />}
          />

          {/* ================= ORDERS ================= */}

          <Route
            path="orders"
            element={<AdminOrders />}
          />

          <Route
            path="orders/:id"
            element={<AdminOrderDetails />}
          />

          {/* ================= CUSTOMERS ================= */}

          <Route
            path="customers"
            element={<Customers />}
          />

          <Route
            path="customers/:id"
            element={<CustomerDetails />}
          />

        </Route>

      </Route>

    </Routes>
  );
};

export default AppRoutes;