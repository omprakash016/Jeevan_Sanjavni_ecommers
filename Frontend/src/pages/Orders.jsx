import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Eye,
  CalendarDays,
  ShoppingBag,
} from "lucide-react";
import { toast } from "react-toastify";

import Container from "../component/ui/Container";

import { getMyOrders } from "../services/orderService";

import "./Order.css";

const Orders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ========================================
  // FETCH ORDERS
  // ========================================

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const response = await getMyOrders();

        if (response.success) {
          setOrders(response.data.orders || []);
        } else {
          toast.error(
            response.message || "Failed to load orders"
          );
        }
      } catch (error) {
        console.error("My Orders Error:", error);

        toast.error(
          error.response?.data?.message ||
            "Failed to load your orders"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ========================================
  // STATUS CLASS
  // ========================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Confirmed":
        return "confirmed";

      case "Shipped":
        return "shipped";

      case "Delivered":
        return "delivered";

      case "Cancelled":
        return "cancelled";

      default:
        return "pending";
    }
  };

  // ========================================
  // DATE FORMAT
  // ========================================

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <section className="orders-page">
        <Container>

          <div className="orders-loading">
            <Package size={42} />

            <h2>Loading your orders...</h2>

            <p>
              Please wait while we fetch your
              orders.
            </p>
          </div>

        </Container>
      </section>
    );
  }

  // ========================================
  // EMPTY ORDERS
  // ========================================

  if (orders.length === 0) {
    return (
      <section className="orders-page">
        <Container>

          <div className="orders-header">
            <div>
              <span className="orders-label">
                JEEVAN SANJIVANI
              </span>

              <h1>My Orders</h1>

              <p>
                Track and manage your orders in
                one place.
              </p>
            </div>
          </div>


          <div className="empty-orders">

            <div className="empty-orders-icon">
              <ShoppingBag size={42} />
            </div>

            <h2>No Orders Yet</h2>

            <p>
              You haven't placed any orders yet.
              Start shopping and your orders
              will appear here.
            </p>

            <button
              onClick={() =>
                navigate("/products")
              }
            >
              Start Shopping
            </button>

          </div>

        </Container>
      </section>
    );
  }

  // ========================================
  // ORDERS PAGE
  // ========================================

  return (
    <section className="orders-page">
      <Container>

        {/* ================================
            HEADER
        ================================= */}

        <div className="orders-header">

          <div>
            <span className="orders-label">
              JEEVAN SANJIVANI
            </span>

            <h1>My Orders</h1>

            <p>
              Track and manage your orders in
              one place.
            </p>
          </div>


          <div className="orders-count">

            <Package size={20} />

            <span>
              {orders.length}{" "}
              {orders.length === 1
                ? "Order"
                : "Orders"}
            </span>

          </div>

        </div>


        {/* ================================
            ORDERS LIST
        ================================= */}

        <div className="orders-list">

          {orders.map((order) => (

            <div
              className="order-list-card"
              key={order._id}
            >

              {/* LEFT */}

              <div className="order-list-left">

                <div className="order-icon">
                  <Package size={24} />
                </div>


                <div className="order-main-info">

                  <div className="order-number">

                    <span>
                      Order #
                    </span>

                    <strong>
                      {order.orderNumber ||
                        order._id.slice(-8)}
                    </strong>

                  </div>


                  <div className="order-date">

                    <CalendarDays size={15} />

                    <span>
                      {formatDate(
                        order.createdAt
                      )}
                    </span>

                  </div>

                </div>

              </div>


              {/* MIDDLE */}

              <div className="order-list-middle">

                <div className="order-info-box">

                  <span>
                    Items
                  </span>

                  <strong>
                    {order.totalQuantity}
                  </strong>

                </div>


                <div className="order-info-box">

                  <span>
                    Total
                  </span>

                  <strong className="order-price">

                    ₹{order.subtotal}

                  </strong>

                </div>


                <div className="order-info-box">

                  <span>
                    Payment
                  </span>

                  <strong>
                    {order.paymentMethod}
                  </strong>

                </div>

              </div>


              {/* RIGHT */}

              <div className="order-list-right">

                <span
                  className={`order-status-badge ${getStatusClass(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus}
                </span>


                <button
                  className="view-order-btn"
                  onClick={() =>
                    navigate(
                      `/orders/${order._id}`
                    )
                  }
                >
                  <Eye size={17} />

                  View Details
                </button>

              </div>

            </div>

          ))}

        </div>

      </Container>
    </section>
  );
};

export default Orders;