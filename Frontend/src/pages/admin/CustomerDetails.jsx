import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  CalendarDays,
  ShieldCheck,
  ShieldOff,
  ShoppingBag,
  CheckCircle2,
  XCircle,
  Clock3,
  Eye,
  RefreshCw,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { toast } from "react-toastify";

import Container from "../../component/ui/Container";

import {
  getAdminCustomerDetails,
  getCustomerOrders,
} from "../../services/adminCustomerService";

import "./CustomerDetails.css";


const CustomerDetails = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const [customer, setCustomer] =
    useState(null);

  const [statistics, setStatistics] =
    useState(null);

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  const fetchCustomer = useCallback(
    async () => {

      try {

        setLoading(true);

        const [
          customerResponse,
          ordersResponse,
        ] = await Promise.all([
          getAdminCustomerDetails(id),
          getCustomerOrders(id),
        ]);


        if (
          !customerResponse.success
        ) {
          toast.error(
            customerResponse.message ||
              "Failed to load customer"
          );
          return;
        }


        if (
          !ordersResponse.success
        ) {
          toast.error(
            ordersResponse.message ||
              "Failed to load customer orders"
          );
          return;
        }


        setCustomer(
          customerResponse.data?.customer
        );

        setStatistics(
          customerResponse.data?.statistics
        );

        setOrders(
          ordersResponse.data?.orders || []
        );

      } catch (error) {

        console.error(
          "Customer Details Error:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to load customer"
        );

      } finally {

        setLoading(false);

      }

    },
    [id]
  );


  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);


  const formatDate = (date) => {

    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };


  const formatCurrency = (amount) => {

    return `₹${Number(
      amount || 0
    ).toLocaleString("en-IN")}`;

  };


  const getOrderStatusClass = (
    status
  ) => {

    switch (status) {

      case "Delivered":
        return "delivered";

      case "Cancelled":
        return "cancelled";

      case "Confirmed":
        return "confirmed";

      case "Processing":
        return "processing";

      case "Shipped":
        return "shipped";

      default:
        return "pending";
    }
  };


  if (loading) {

    return (
      <section className="customer-details-page">

        <Container>

          <div className="customer-details-loading">

            <RefreshCw
              size={42}
              className="spin"
            />

            <h2>
              Loading Customer...
            </h2>

          </div>

        </Container>

      </section>
    );
  }


  if (!customer) {

    return (
      <section className="customer-details-page">

        <Container>

          <div className="customer-not-found">

            <User size={50} />

            <h2>
              Customer Not Found
            </h2>

            <button
              onClick={() =>
                navigate(
                  "/admin/customers"
                )
              }
            >
              <ArrowLeft size={17} />
              Back to Customers
            </button>

          </div>

        </Container>

      </section>
    );
  }


  return (

    <section className="customer-details-page">

      <Container>

        {/* =====================================
            BACK
        ===================================== */}

        <button
          className="customer-back-btn"
          onClick={() =>
            navigate(
              "/admin/customers"
            )
          }
        >
          <ArrowLeft size={17} />
          Back to Customers
        </button>


        {/* =====================================
            CUSTOMER HERO
        ===================================== */}

        <div className="customer-profile-card">

          <div className="customer-details-avatar">

            {customer.profileImage?.url ? (

              <img
                src={
                  customer.profileImage.url
                }
                alt={customer.fullName}
              />

            ) : (

              <User size={42} />

            )}

          </div>


          <div className="customer-profile-main">

            <span className="customer-label">
              CUSTOMER PROFILE
            </span>

            <h1>
              {customer.fullName}
            </h1>

            <div className="customer-contact-line">

              <span>
                <Mail size={16} />
                {customer.email}
              </span>

              <span>
                <Phone size={16} />
                {customer.phone}
              </span>

            </div>

          </div>


          <div className="customer-profile-status">

            <span
              className={
                customer.isActive
                  ? "detail-active"
                  : "detail-blocked"
              }
            >

              {customer.isActive ? (
                <>
                  <ShieldCheck
                    size={17}
                  />
                  Active
                </>
              ) : (
                <>
                  <ShieldOff
                    size={17}
                  />
                  Blocked
                </>
              )}

            </span>

            <small>
              Joined{" "}
              {formatDate(
                customer.createdAt
              )}
            </small>

          </div>

        </div>


        {/* =====================================
            STATISTICS
        ===================================== */}

        <div className="customer-stats-grid">

          <div className="customer-stat-card">

            <div className="stat-icon green">
              <ShoppingBag />
            </div>

            <div>
              <span>
                Total Orders
              </span>

              <strong>
                {statistics?.totalOrders || 0}
              </strong>
            </div>

          </div>


          <div className="customer-stat-card">

            <div className="stat-icon blue">
              <CheckCircle2 />
            </div>

            <div>
              <span>
                Delivered
              </span>

              <strong>
                {statistics?.deliveredOrders || 0}
              </strong>
            </div>

          </div>


          <div className="customer-stat-card">

            <div className="stat-icon red">
              <XCircle />
            </div>

            <div>
              <span>
                Cancelled
              </span>

              <strong>
                {statistics?.cancelledOrders || 0}
              </strong>
            </div>

          </div>


          <div className="customer-stat-card">

            <div className="stat-icon gold">
              ₹
            </div>

            <div>
              <span>
                Total Spent
              </span>

              <strong>
                {formatCurrency(
                  statistics?.totalSpent
                )}
              </strong>
            </div>

          </div>

        </div>


        {/* =====================================
            DETAILS + ORDERS
        ===================================== */}

        <div className="customer-details-grid">


          {/* CUSTOMER INFORMATION */}

          <div className="customer-info-card">

            <div className="customer-card-title">

              <User size={20} />

              <div>

                <h2>
                  Customer Information
                </h2>

                <span>
                  Account details
                </span>

              </div>

            </div>


            <div className="customer-info-list">

              <div>
                <span>
                  Full Name
                </span>

                <strong>
                  {customer.fullName}
                </strong>
              </div>


              <div>
                <span>
                  Email
                </span>

                <strong>
                  {customer.email}
                </strong>
              </div>


              <div>
                <span>
                  Phone
                </span>

                <strong>
                  {customer.phone}
                </strong>
              </div>


              <div>
                <span>
                  Verification
                </span>

                <strong
                  className={
                    customer.isVerified
                      ? "verified-text"
                      : "unverified-text"
                  }
                >

                  {customer.isVerified
                    ? "Verified"
                    : "Not Verified"}

                </strong>

              </div>


              <div>
                <span>
                  Account Status
                </span>

                <strong>
                  {customer.isActive
                    ? "Active"
                    : "Blocked"}
                </strong>
              </div>


              <div>
                <span>
                  Joined
                </span>

                <strong>
                  {formatDate(
                    customer.createdAt
                  )}
                </strong>
              </div>

            </div>

          </div>


          {/* ORDERS */}

          <div className="customer-orders-card">

            <div className="customer-card-title">

              <ShoppingBag size={20} />

              <div>

                <h2>
                  Order History
                </h2>

                <span>
                  {orders.length} orders
                </span>

              </div>

            </div>


            {orders.length === 0 ? (

              <div className="customer-no-orders">

                <ShoppingBag size={40} />

                <h3>
                  No Orders Yet
                </h3>

                <p>
                  This customer has not
                  placed any orders.
                </p>

              </div>

            ) : (

              <div className="customer-orders-list">

                {orders.map(
                  (order) => (

                    <div
                      className="customer-order-row"
                      key={order._id}
                    >

                      <div className="order-main">

                        <strong>
                          {order.orderNumber ||
                            `#${order._id.slice(-8).toUpperCase()}`}
                        </strong>

                        <span>
                          <CalendarDays
                            size={14}
                          />

                          {formatDate(
                            order.createdAt
                          )}
                        </span>

                      </div>


                      <div className="order-meta">

                        <span>
                          {order.totalQuantity} items
                        </span>

                        <strong>
                          {formatCurrency(
                            order.subtotal
                          )}
                        </strong>

                      </div>


                      <span
                        className={`customer-order-status ${getOrderStatusClass(
                          order.orderStatus
                        )}`}
                      >

                        {order.orderStatus}

                      </span>


                      <button
                        className="customer-order-view"
                        onClick={() =>
                          navigate(
                            `/admin/orders/${order._id}`
                          )
                        }
                      >

                        <Eye size={16} />

                        View

                      </button>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </div>

      </Container>

    </section>

  );
};


export default CustomerDetails;