import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  XCircle,
  CheckCircle,
  Clock,
  Truck,
} from "lucide-react";
import "./orderDetails.css";
import Container from "../component/ui/Container";

import {
  getOrderDetails,
  cancelOrder,
} from "../services/orderService";



const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  // ========================================
  // GET ORDER DETAILS
  // ========================================

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);

        const response = await getOrderDetails(id);

        if (response.success) {
          setOrder(response.data.order);
        } else {
          toast.error(
            response.message || "Failed to load order"
          );
        }
      } catch (error) {
        console.error("Order details error:", error);

        toast.error(
          error.response?.data?.message ||
            "Failed to load order details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  // ========================================
  // CANCEL ORDER
  // ========================================

  const handleCancelOrder = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      setCancelling(true);

      const response = await cancelOrder(id);

      if (response.success) {
        toast.success(
          "Order cancelled successfully"
        );

        setOrder(response.data.order);
      } else {
        toast.error(
          response.message || "Unable to cancel order"
        );
      }
    } catch (error) {
      console.error("Cancel order error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to cancel order"
      );
    } finally {
      setCancelling(false);
    }
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <section className="order-details-page">
        <Container>
          <div className="order-details-loading">
            <Package size={40} />
            <h2>Loading order...</h2>
            <p>
              Please wait while we fetch your order
              details.
            </p>
          </div>
        </Container>
      </section>
    );
  }

  // ========================================
  // ORDER NOT FOUND
  // ========================================

  if (!order) {
    return (
      <section className="order-details-page">
        <Container>
          <div className="order-not-found">
            <Package size={55} />

            <h2>Order Not Found</h2>

            <p>
              We couldn't find the order you're
              looking for.
            </p>

            <button
              onClick={() => navigate("/orders")}
            >
              Back to My Orders
            </button>
          </div>
        </Container>
      </section>
    );
  }

  // ========================================
  // STATUS ICON
  // ========================================

  const getStatusIcon = () => {
    switch (order.orderStatus) {
      case "Confirmed":
        return <CheckCircle size={20} />;

      case "Shipped":
        return <Truck size={20} />;

      case "Delivered":
        return <CheckCircle size={20} />;

      case "Cancelled":
        return <XCircle size={20} />;

      default:
        return <Clock size={20} />;
    }
  };

  // ========================================
  // STATUS CLASS
  // ========================================

  const getStatusClass = () => {
    switch (order.orderStatus) {
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
  // DATE
  // ========================================

  const formattedDate = new Date(
    order.createdAt
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const formattedTime = new Date(
    order.createdAt
  ).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // ========================================
  // RETURN
  // ========================================

  return (
    <section className="order-details-page">
      <Container>

        {/* ================================
            BACK BUTTON
        ================================= */}

        <button
          className="order-back-btn"
          onClick={() => navigate("/orders")}
        >
          <ArrowLeft size={18} />
          Back to My Orders
        </button>


        {/* ================================
            HEADER
        ================================= */}

        <div className="order-details-header">

          <div>
            <span className="order-label">
              ORDER DETAILS
            </span>

            <h1>
              Order #{order.orderNumber}
            </h1>

            <p>
              Placed on {formattedDate} at{" "}
              {formattedTime}
            </p>
          </div>


          <div
            className={`order-status ${getStatusClass()}`}
          >
            {getStatusIcon()}
            <span>{order.orderStatus}</span>
          </div>

        </div>


        {/* ================================
            MAIN GRID
        ================================= */}

        <div className="order-details-grid">


          {/* ================================
              LEFT
          ================================= */}

          <div className="order-details-left">


            {/* ORDER ITEMS */}

            <div className="order-card">

              <div className="order-card-title">

                <div>
                  <Package size={21} />

                  <h2>
                    Ordered Products
                  </h2>
                </div>

                <span>
                  {order.totalQuantity} items
                </span>

              </div>


              <div className="order-items-list">

                {order.items?.map(
                  (item, index) => (

                    <div
                      className="order-item"
                      key={`${item.product}-${index}`}
                    >

                      <div className="order-item-image">

                        <img
                          src={item.image}
                          alt={item.name}
                        />

                      </div>


                      <div className="order-item-info">

                        <h3>
                          {item.name}
                        </h3>

                        <p>
                          ₹{item.price} ×{" "}
                          {item.quantity}
                        </p>

                      </div>


                      <div className="order-item-total">

                        ₹{item.subtotal}

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>


            {/* DELIVERY ADDRESS */}

            <div className="order-card">

              <div className="order-card-title">

                <div>
                  <MapPin size={21} />

                  <h2>
                    Delivery Address
                  </h2>
                </div>

              </div>


              <div className="delivery-address">

                <div className="address-type">

                  {order.address?.addressType ||
                    "Home"}

                </div>

                <h3>
                  {order.address?.fullName}
                </h3>

                <p>
                  {order.address?.addressLine1}
                </p>

                {order.address?.addressLine2 && (
                  <p>
                    {order.address.addressLine2}
                  </p>
                )}

                {order.address?.landmark && (
                  <p>
                    {order.address.landmark}
                  </p>
                )}

                <p>
                  {order.address?.city},{" "}
                  {order.address?.state} -{" "}
                  {order.address?.postalCode}
                </p>

                <p>
                  {order.address?.country}
                </p>

                <div className="address-phone">
                  Phone:{" "}
                  {order.address?.phone}
                </div>

              </div>

            </div>


          </div>


          {/* ================================
              RIGHT
          ================================= */}

          <div className="order-details-right">


            {/* ORDER SUMMARY */}

            <div className="order-card order-summary-card">

              <div className="order-card-title">

                <div>
                  <CreditCard size={21} />

                  <h2>
                    Order Summary
                  </h2>
                </div>

              </div>


              <div className="summary-row">

                <span>
                  Total Items
                </span>

                <strong>
                  {order.totalItems}
                </strong>

              </div>


              <div className="summary-row">

                <span>
                  Total Quantity
                </span>

                <strong>
                  {order.totalQuantity}
                </strong>

              </div>


              <div className="summary-row">

                <span>
                  Subtotal
                </span>

                <strong>
                  ₹{order.subtotal}
                </strong>

              </div>


              <div className="summary-row">

                <span>
                  Shipping
                </span>

                <strong className="free">
                  FREE
                </strong>

              </div>


              <hr />


              <div className="summary-total">

                <span>
                  Total
                </span>

                <strong>
                  ₹{order.subtotal}
                </strong>

              </div>

            </div>


            {/* PAYMENT */}

            <div className="order-card payment-card">

              <div className="order-card-title">

                <div>
                  <CreditCard size={21} />

                  <h2>
                    Payment
                  </h2>
                </div>

              </div>


              <div className="payment-row">

                <span>
                  Method
                </span>

                <strong>
                  {order.paymentMethod}
                </strong>

              </div>


              <div className="payment-row">

                <span>
                  Status
                </span>

                <span
                  className={`payment-status ${
                    order.paymentStatus
                      ?.toLowerCase()
                  }`}
                >
                  {order.paymentStatus}
                </span>

              </div>

            </div>


            {/* CANCEL ORDER */}

            {["Pending", "Confirmed"].includes(
              order.orderStatus
            ) && (
              <button
                className="cancel-order-btn"
                onClick={handleCancelOrder}
                disabled={cancelling}
              >
                <XCircle size={19} />

                {cancelling
                  ? "Cancelling..."
                  : "Cancel Order"}
              </button>
            )}


            {/* CANCELLED INFO */}

            {order.orderStatus ===
              "Cancelled" && (
              <div className="cancelled-message">

                <XCircle size={20} />

                <div>

                  <strong>
                    Order Cancelled
                  </strong>

                  <p>
                    This order has been
                    cancelled successfully.
                  </p>

                </div>

              </div>
            )}

          </div>

        </div>

      </Container>
    </section>
  );
};

export default OrderDetails;