import { Routes, Route } from "react-router-dom";
// Layouts
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

// Route Guards
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

// Public Pages
import Home from "../pages/Home";
import Products from "../pages/Products";
import ProductDetails from "../pages/ProductDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";

// Customer Pages
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Profile from "../pages/Profile";
import OrderDetails from "../pages/OrderDetails";
import Orders from "../pages/Orders";
// Admin Pages
import Dashboard from "../pages/admin/Dashboard";
import AdminProducts from "../pages/admin/Products";
import AdminOrders from "../pages/admin/Orders";
import AddProduct from "../pages/admin/AddProduct";
import EditProduct from "../pages/admin/EditProduct";
import AdminProductDetails from "../pages/admin/AdminProductDetails";
import AdminOrderDetails from "../pages/admin/AdminOrderDetails";
const AppRoutes = () => {
  return (
    <Routes>

      {/* ================= PUBLIC ================= */}

      <Route element={<MainLayout />}>

        <Route path="/" element={<Home />} />

        <Route path="/products" element={<Products />} />

        <Route
          path="/products/:slug"
          element={<ProductDetails />}
        />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

      </Route>


      {/* ================= CUSTOMER ================= */}

      <Route element={<PrivateRoute />}>

        <Route element={<MainLayout />}>

          <Route path="/cart" element={<Cart />} />

          <Route path="/checkout" element={<Checkout />} />

          <Route path="/profile" element={<Profile />} />
         <Route
              path="/orders"
              element={<Orders />}
        />
         <Route
                path="/orders/:id"
                element={<OrderDetails />}
              />

        </Route>
  

      </Route>


      {/* ================= ADMIN ================= */}

      <Route element={<AdminRoute />}>

        <Route path="/admin" element={<AdminLayout />}>

          <Route index element={<Dashboard />} />

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
           path="/admin/products/:slug/edit"
         element={<EditProduct />}
      />
      <Route
            path="orders"
            element={<AdminOrders />}
          />
     <Route
      path="orders/:id"
      element={<AdminOrderDetails />}
    />
      
        </Route>

      </Route>

    </Routes>
  );
};

export default AppRoutes;