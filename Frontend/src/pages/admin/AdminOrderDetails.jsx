import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Truck,
  CalendarDays,
  Phone,
  CheckCircle2,
  Clock3,
  XCircle,
  RefreshCw,
} from "lucide-react";

import { toast } from "react-toastify";

import Container from "../../component/ui/Container";

import {
  getAdminOrderDetails,
  updateAdminOrderStatus,
} from "../../services/adminOrderService";

import "./AdminOrderDetails.css";


const AdminOrderDetails = () => {

  const { id } = useParams();

  const navigate = useNavigate();


  // ========================================
  // STATE
  // ========================================

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);

  const [updatingStatus, setUpdatingStatus] =
    useState(false);

  const [selectedStatus, setSelectedStatus] =
    useState("");

  const [selectedPaymentStatus, setSelectedPaymentStatus] =
    useState("");


  // ========================================
  // FETCH ORDER
  // ========================================

  const fetchOrder = useCallback(async () => {

    try {

      setLoading(true);

      const response =
        await getAdminOrderDetails(id);


      if (!response.success) {

        toast.error(
          response.message ||
            "Failed to load order"
        );

        return;
      }


      const fetchedOrder =
        response.data?.order;


      setOrder(fetchedOrder);


      // Order status

      setSelectedStatus(
        fetchedOrder?.orderStatus || ""
      );


      // Payment status

      setSelectedPaymentStatus(
        fetchedOrder?.paymentStatus || ""
      );


    } catch (error) {

      console.error(
        "Admin Order Details Error:",
        error
      );


      toast.error(
        error.response?.data?.message ||
          "Failed to load order"
      );

    } finally {

      setLoading(false);

    }

  }, [id]);


  useEffect(() => {

    fetchOrder();

  }, [fetchOrder]);


  // ========================================
  // STATUS OPTIONS
  // ========================================

  const getStatusOptions = () => {

    if (!order) return [];


    switch (order.orderStatus) {

      case "Pending":

        return [
          "Pending",
          "Confirmed",
          "Cancelled",
        ];


      case "Confirmed":

        return [
          "Confirmed",
          "Processing",
          "Cancelled",
        ];


      case "Processing":

        return [
          "Processing",
          "Shipped",
          "Cancelled",
        ];


      case "Shipped":

        return [
          "Shipped",
          "Delivered",
        ];


      case "Delivered":

        return [
          "Delivered",
        ];


      case "Cancelled":

        return [
          "Cancelled",
        ];


      default:

        return [
          order.orderStatus,
        ];

    }

  };


  // ========================================
  // UPDATE ORDER STATUS
  // ========================================

  const handleStatusUpdate = async () => {

    if (!order) return;


    if (
      selectedStatus ===
      order.orderStatus
    ) {

      toast.info(
        "Order status is already " +
          order.orderStatus
      );

      return;
    }


    const confirmed = window.confirm(
      `Are you sure you want to change the order status from "${order.orderStatus}" to "${selectedStatus}"?`
    );


    if (!confirmed) {

      setSelectedStatus(
        order.orderStatus
      );

      return;
    }


    try {

      setUpdatingStatus(true);


      const response =
        await updateAdminOrderStatus(
          order._id,
          selectedStatus
        );


      if (response.success) {

        const updatedOrder =
          response.data?.order;


        setOrder(
          updatedOrder || {
            ...order,
            orderStatus:
              selectedStatus,
          }
        );


        setSelectedStatus(
          updatedOrder?.orderStatus ||
            selectedStatus
        );


        // Also update payment status
        // because COD Delivered automatically
        // becomes Successful in backend.

        setSelectedPaymentStatus(
          updatedOrder?.paymentStatus ||
            order.paymentStatus
        );


        toast.success(
          response.message ||
            "Order status updated successfully"
        );

      } else {

        toast.error(
          response.message ||
            "Failed to update order status"
        );


        setSelectedStatus(
          order.orderStatus
        );

      }

    } catch (error) {

      console.error(
        "Update Order Status Error:",
        error
      );


      toast.error(
        error.response?.data?.message ||
          "Failed to update order status"
      );


      setSelectedStatus(
        order.orderStatus
      );

    } finally {

      setUpdatingStatus(false);

    }

  };


  // ========================================
  // UPDATE COD PAYMENT STATUS
  // ========================================

  const handlePaymentStatusUpdate = async () => {

    if (!order) return;


    // Only COD orders

    if (
      order.paymentMethod !== "COD"
    ) {

      toast.error(
        "Only COD orders can be marked as Successful."
      );

      return;
    }


    // Already successful

    if (
      order.paymentStatus ===
      "Successful"
    ) {

      toast.info(
        "Payment is already Successful."
      );

      return;
    }


    // Only Successful is allowed

    if (
      selectedPaymentStatus !==
      "Successful"
    ) {

      toast.error(
        "Please select Successful payment status."
      );

      return;
    }


    const confirmed = window.confirm(
      "Are you sure you want to mark this COD payment as Successful?"
    );


    if (!confirmed) {

      setSelectedPaymentStatus(
        order.paymentStatus
      );

      return;
    }


    try {

      setUpdatingStatus(true);


      /*
        IMPORTANT:

        orderStatus is undefined because
        we are only updating paymentStatus.
      */

      const response =
        await updateAdminOrderStatus(
          order._id,
          undefined,
          "Successful"
        );


      if (response.success) {

        const updatedOrder =
          response.data?.order;


        setOrder(
          updatedOrder || {
            ...order,
            paymentStatus:
              "Successful",
          }
        );


        setSelectedPaymentStatus(
          updatedOrder?.paymentStatus ||
            "Successful"
        );


        toast.success(
          "COD payment marked as Successful."
        );

      } else {

        toast.error(
          response.message ||
            "Failed to update payment status."
        );


        setSelectedPaymentStatus(
          order.paymentStatus
        );

      }

    } catch (error) {

      console.error(
        "Payment Status Error:",
        error
      );


      toast.error(
        error.response?.data?.message ||
          "Failed to update payment status."
      );


      setSelectedPaymentStatus(
        order.paymentStatus
      );

    } finally {

      setUpdatingStatus(false);

    }

  };


  // ========================================
  // FORMAT DATE
  // ========================================

  const formatDate = (date) => {

    if (!date) return "—";


    return new Date(
      date
    ).toLocaleDateString("en-IN", {

      day: "2-digit",

      month: "long",

      year: "numeric",

    });

  };


  // ========================================
  // FORMAT TIME
  // ========================================

  const formatTime = (date) => {

    if (!date) return "—";


    return new Date(
      date
    ).toLocaleTimeString("en-IN", {

      hour: "2-digit",

      minute: "2-digit",

    });

  };


  // ========================================
  // ORDER STATUS CLASS
  // ========================================

  const getStatusClass = (status) => {

    switch (status) {

      case "Confirmed":
        return "confirmed";

      case "Processing":
        return "processing";

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
  // PAYMENT STATUS CLASS
  // ========================================

  const getPaymentClass = (status) => {

    if (
      status?.toLowerCase() ===
        "successful" ||
      status?.toLowerCase() ===
        "paid"
    ) {

      return "paid";

    }


    return "pending";

  };


  // ========================================
  // LOADING
  // ========================================

  if (loading) {

    return (

      <section className="admin-order-details-page">

        <Container>

          <div className="admin-order-details-loading">

            <Package size={44} />

            <h2>
              Loading order...
            </h2>

            <p>
              Please wait while we fetch
              the order details.
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

      <section className="admin-order-details-page">

        <Container>

          <div className="admin-order-not-found">

            <div className="not-found-icon">

              <Package size={38} />

            </div>


            <h2>
              Order Not Found
            </h2>


            <p>
              The order you are looking for
              could not be found.
            </p>


            <Link
              to="/admin/orders"
              className="back-orders-btn"
            >

              <ArrowLeft size={17} />

              Back to Orders

            </Link>

          </div>

        </Container>

      </section>

    );

  }


  const statusOptions =
    getStatusOptions();


  // ========================================
  // RETURN
  // ========================================

  return (

    <section className="admin-order-details-page">

      <Container>


        {/* ==================================
            TOP HEADER
        ================================== */}

        <div className="admin-order-details-header">

          <div>

            <button
              className="back-to-orders"
              onClick={() =>
                navigate("/admin/orders")
              }
            >

              <ArrowLeft size={17} />

              Back to Orders

            </button>


            <div className="admin-order-heading">

              <div>

                <span className="admin-order-label">
                  ORDER DETAILS
                </span>


                <h1>

                  {order.orderNumber ||
                    `#${order._id.slice(-8)}`}

                </h1>


                <p>

                  Order placed on{" "}

                  {formatDate(
                    order.createdAt
                  )}

                  {" "}at{" "}

                  {formatTime(
                    order.createdAt
                  )}

                </p>

              </div>


              <span
                className={`admin-order-details-status ${getStatusClass(
                  order.orderStatus
                )}`}
              >

                {order.orderStatus}

              </span>

            </div>

          </div>


          <button
            className="refresh-order-btn"
            onClick={fetchOrder}
            disabled={updatingStatus}
            title="Refresh order"
          >

            <RefreshCw size={18} />

            Refresh

          </button>

        </div>


        {/* ==================================
            MAIN GRID
        ================================== */}

        <div className="admin-order-details-grid">


          {/* ==================================
              LEFT COLUMN
          ================================== */}

          <div className="admin-order-details-main">


            {/* ==================================
                PRODUCTS
            ================================== */}

            <div className="admin-order-card">

              <div className="admin-order-card-header">

                <div className="card-title">

                  <Package size={19} />

                  <div>

                    <h2>
                      Ordered Products
                    </h2>

                    <span>

                      {order.totalQuantity}{" "}

                      {order.totalQuantity === 1
                        ? "item"
                        : "items"}

                    </span>

                  </div>

                </div>

              </div>


              <div className="admin-ordered-products">

                {order.items?.map(
                  (item, index) => (

                    <div
                      className="admin-ordered-product"
                      key={`${item.product || index}-${index}`}
                    >

                      <div className="admin-product-image">

                        {item.image ? (

                          <img
                            src={item.image}
                            alt={item.name}
                          />

                        ) : (

                          <Package
                            size={28}
                          />

                        )}

                      </div>


                      <div className="admin-ordered-product-info">

                        <h3>
                          {item.name}
                        </h3>


                        <p>

                          ₹{item.price} ×{" "}

                          {item.quantity}

                        </p>

                      </div>


                      <div className="admin-product-subtotal">

                        <span>
                          Subtotal
                        </span>


                        <strong>
                          ₹{item.subtotal}
                        </strong>

                      </div>

                    </div>

                  )
                )}

              </div>


              {/* ORDER TOTALS */}

              <div className="admin-order-totals">

                <div>

                  <span>
                    Total Products
                  </span>

                  <strong>
                    {order.totalItems}
                  </strong>

                </div>


                <div>

                  <span>
                    Total Quantity
                  </span>

                  <strong>
                    {order.totalQuantity}
                  </strong>

                </div>


                <div className="grand-total">

                  <span>
                    Order Total
                  </span>

                  <strong>
                    ₹{order.subtotal}
                  </strong>

                </div>

              </div>

            </div>


            {/* ==================================
                CUSTOMER
            ================================== */}

            <div className="admin-order-card">

              <div className="admin-order-card-header">

                <div className="card-title">

                  <User size={19} />

                  <div>

                    <h2>
                      Customer Information
                    </h2>

                    <span>
                      Delivery contact
                    </span>

                  </div>

                </div>

              </div>


              <div className="admin-customer-info">

                <div className="customer-info-item">

                  <span>
                    Full Name
                  </span>

                  <strong>

                    {order.address
                      ?.fullName ||
                      "—"}

                  </strong>

                </div>


                <div className="customer-info-item">

                  <span>
                    Phone
                  </span>


                  <a
                    href={`tel:${
                      order.address
                        ?.phone || ""
                    }`}
                  >

                    <Phone size={15} />

                    {order.address
                      ?.phone || "—"}

                  </a>

                </div>

              </div>

            </div>


            {/* ==================================
                ADDRESS
            ================================== */}

            <div className="admin-order-card">

              <div className="admin-order-card-header">

                <div className="card-title">

                  <MapPin size={19} />

                  <div>

                    <h2>
                      Delivery Address
                    </h2>

                    <span>
                      Shipping information
                    </span>

                  </div>

                </div>

              </div>


              <div className="admin-delivery-address">

                <div className="address-type">

                  {order.address
                    ?.addressType ||
                    "Home"}

                </div>


                <strong>

                  {order.address
                    ?.fullName ||
                    "—"}

                </strong>


                <p>

                  {order.address
                    ?.addressLine1 ||
                    ""}

                </p>


                {order.address
                  ?.addressLine2 && (

                  <p>

                    {
                      order.address
                        .addressLine2
                    }

                  </p>

                )}


                {order.address
                  ?.landmark && (

                  <p>

                    <strong>
                      Landmark:
                    </strong>{" "}

                    {
                      order.address
                        .landmark
                    }

                  </p>

                )}


                <p>

                  {order.address?.city},{" "}

                  {order.address?.state}

                  {" - "}

                  {order.address
                    ?.postalCode}

                </p>


                <p>

                  {order.address
                    ?.country ||
                    "India"}

                </p>


                {order.address?.phone && (

                  <div className="address-phone">

                    <Phone size={15} />

                    {
                      order.address
                        .phone
                    }

                  </div>

                )}

              </div>

            </div>

          </div>


          {/* ==================================
              RIGHT COLUMN
          ================================== */}

          <aside className="admin-order-details-sidebar">


            {/* ==================================
                UPDATE ORDER STATUS
            ================================== */}

            <div className="admin-order-card status-card">

              <div className="admin-order-card-header">

                <div className="card-title">

                  <Truck size={19} />

                  <div>

                    <h2>
                      Order Status
                    </h2>

                    <span>
                      Manage order progress
                    </span>

                  </div>

                </div>

              </div>


              <div className="current-status-box">

                <span>
                  Current Status
                </span>


                <strong
                  className={`admin-current-status ${getStatusClass(
                    order.orderStatus
                  )}`}
                >

                  {order.orderStatus}

                </strong>

              </div>


              <label className="status-select-label">

                Change Status

              </label>


              <select
                value={selectedStatus}
                onChange={(event) =>
                  setSelectedStatus(
                    event.target.value
                  )
                }
                disabled={
                  updatingStatus ||
                  order.orderStatus ===
                    "Delivered" ||
                  order.orderStatus ===
                    "Cancelled"
                }
                className="admin-status-select"
              >

                {statusOptions.map(
                  (status) => (

                    <option
                      value={status}
                      key={status}
                    >

                      {status}

                    </option>

                  )
                )}

              </select>


              <button
                className="update-status-btn"
                onClick={
                  handleStatusUpdate
                }
                disabled={
                  updatingStatus ||
                  selectedStatus ===
                    order.orderStatus ||
                  order.orderStatus ===
                    "Delivered" ||
                  order.orderStatus ===
                    "Cancelled"
                }
              >

                {updatingStatus ? (

                  <>

                    <RefreshCw
                      size={17}
                      className="spin"
                    />

                    Updating...

                  </>

                ) : (

                  <>

                    <CheckCircle2
                      size={17}
                    />

                    Update Status

                  </>

                )}

              </button>


              {(order.orderStatus ===
                "Delivered" ||
                order.orderStatus ===
                  "Cancelled") && (

                <p className="status-locked-message">

                  {order.orderStatus ===
                  "Delivered"
                    ? "This order has been delivered and its status cannot be changed."
                    : "This order has been cancelled and its status cannot be changed."}

                </p>

              )}

            </div>


            {/* ==================================
                PAYMENT
            ================================== */}

            <div className="admin-order-card">

              <div className="admin-order-card-header">

                <div className="card-title">

                  <CreditCard size={19} />

                  <div>

                    <h2>
                      Payment
                    </h2>

                    <span>
                      Payment information
                    </span>

                  </div>

                </div>

              </div>


              <div className="payment-details">

                {/* PAYMENT METHOD */}

                <div className="payment-detail-row">

                  <span>
                    Method
                  </span>


                  <strong>
                    {order.paymentMethod ||
                      "—"}
                  </strong>

                </div>


                {/* PAYMENT STATUS */}

                <div className="payment-detail-row">

                  <span>
                    Status
                  </span>


                  <strong
                    className={`payment-status ${getPaymentClass(
                      order.paymentStatus
                    )}`}
                  >

                    {order.paymentStatus ||
                      "—"}

                  </strong>

                </div>


                {/* TOTAL */}

                <div className="payment-detail-row total">

                  <span>
                    Total
                  </span>


                  <strong>
                    ₹{order.subtotal}
                  </strong>

                </div>

              </div>


              {/* ==================================
                  COD PAYMENT ACTION
              ================================== */}

              {order.paymentMethod ===
                "COD" &&

                order.paymentStatus ===
                  "Pending" && (

                  <div className="admin-cod-payment-action">


                    <div className="cod-payment-info">

                      <strong>
                        Cash on Delivery
                      </strong>


                      <span>

                        Payment is currently
                        pending. Mark it as
                        successful after
                        receiving the cash.

                      </span>

                    </div>


                    <select
                      value={
                        selectedPaymentStatus
                      }
                      onChange={(event) =>
                        setSelectedPaymentStatus(
                          event.target.value
                        )
                      }
                      disabled={
                        updatingStatus
                      }
                      className="admin-payment-select"
                    >

                      <option value="Pending">
                        Pending
                      </option>


                      <option value="Successful">
                        Successful
                      </option>

                    </select>


                    <button
                      className="payment-success-btn"
                      onClick={
                        handlePaymentStatusUpdate
                      }
                      disabled={
                        updatingStatus ||
                        selectedPaymentStatus !==
                          "Successful"
                      }
                    >

                      {updatingStatus ? (

                        <>

                          <RefreshCw
                            size={17}
                            className="spin"
                          />

                          Updating...

                        </>

                      ) : (

                        <>

                          <CheckCircle2
                            size={17}
                          />

                          Mark Payment Successful

                        </>

                      )}

                    </button>

                  </div>

                )}

            </div>


            {/* ==================================
                ORDER TIMELINE
            ================================== */}

            <div className="admin-order-card">

              <div className="admin-order-card-header">

                <div className="card-title">

                  <CalendarDays
                    size={19}
                  />

                  <div>

                    <h2>
                      Order Timeline
                    </h2>

                    <span>
                      Order activity
                    </span>

                  </div>

                </div>

              </div>


              <div className="order-timeline">


                {/* ORDER PLACED */}

                <div className="timeline-item">

                  <div className="timeline-icon created">

                    <CheckCircle2
                      size={15}
                    />

                  </div>


                  <div>

                    <strong>
                      Order Placed
                    </strong>


                    <span>

                      {formatDate(
                        order.createdAt
                      )}

                    </span>

                  </div>

                </div>


                {/* CANCELLED */}

                {order.cancelledAt && (

                  <div className="timeline-item">

                    <div className="timeline-icon cancelled">

                      <XCircle
                        size={15}
                      />

                    </div>


                    <div>

                      <strong>
                        Order Cancelled
                      </strong>


                      <span>

                        {formatDate(
                          order.cancelledAt
                        )}

                      </span>


                      {order.cancelReason && (

                        <small>

                          {
                            order.cancelReason
                          }

                        </small>

                      )}

                    </div>

                  </div>

                )}


                {/* CURRENT STATUS */}

                {!order.cancelledAt &&

                  order.orderStatus !==
                    "Pending" && (

                    <div className="timeline-item">

                      <div className="timeline-icon progress">

                        <Clock3
                          size={15}
                        />

                      </div>


                      <div>

                        <strong>
                          Current Status
                        </strong>


                        <span>

                          {
                            order.orderStatus
                          }

                        </span>

                      </div>

                    </div>

                  )}

              </div>

            </div>

          </aside>

        </div>

      </Container>

    </section>

  );

};


export default AdminOrderDetails;