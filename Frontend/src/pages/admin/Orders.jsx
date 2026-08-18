import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  RefreshCw,
  Package,
} from "lucide-react";
import { toast } from "react-toastify";

import Container from "../../component/ui/Container";

import {
  getAdminOrders,
} from "../../services/adminOrderService";

import "./Orders.css";

const AdminOrders = () => {
  // ========================================
  // STATE
  // ========================================

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [orderStatus, setOrderStatus] = useState("");

  const [paymentStatus, setPaymentStatus] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("");

  const [sort, setSort] =
    useState("latest");

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    limit: 10,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // ========================================
  // FETCH ORDERS
  // ========================================

  const fetchOrders = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) {
          setLoading(true);
        }

        const response = await getAdminOrders({
          page,
          limit: 10,
          search: search.trim(),
          orderStatus,
          paymentStatus,
          paymentMethod,
          sort,
        });

        if (response.success) {
          setOrders(response.data.orders || []);

          setPagination(
            response.data.pagination || {
              currentPage: 1,
              totalPages: 1,
              totalOrders: 0,
              limit: 10,
              hasNextPage: false,
              hasPreviousPage: false,
            }
          );
        } else {
          toast.error(
            response.message ||
              "Failed to load orders"
          );
        }
      } catch (error) {
        console.error(
          "Admin Orders Error:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to load orders"
        );
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    },
    [
      page,
      search,
      orderStatus,
      paymentStatus,
      paymentMethod,
      sort,
    ]
  );

  // ========================================
  // FETCH WHEN FILTERS CHANGE
  // ========================================

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ========================================
  // SEARCH
  // ========================================

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  // ========================================
  // FILTER CHANGE
  // ========================================

  const handleOrderStatusChange = (event) => {
    setOrderStatus(event.target.value);
    setPage(1);
  };

  const handlePaymentStatusChange = (event) => {
    setPaymentStatus(event.target.value);
    setPage(1);
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
    setPage(1);
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
    setPage(1);
  };

  // ========================================
  // CLEAR FILTERS
  // ========================================

  const clearFilters = () => {
    setSearch("");
    setOrderStatus("");
    setPaymentStatus("");
    setPaymentMethod("");
    setSort("latest");
    setPage(1);
  };

  // ========================================
  // REFRESH
  // ========================================

  const handleRefresh = () => {
    fetchOrders();
  };

  // ========================================
  // FORMAT DATE
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

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ========================================
  // STATUS CLASS
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
  // LOADING
  // ========================================

  if (loading) {
    return (
      <section className="admin-orders-page">
        <Container>

          <div className="admin-orders-loading">

            <Package size={42} />

            <h2>
              Loading orders...
            </h2>

            <p>
              Please wait while we fetch
              customer orders.
            </p>

          </div>

        </Container>
      </section>
    );
  }

  // ========================================
  // RETURN
  // ========================================

  return (
    <section className="admin-orders-page">
      <Container>

        {/* ==================================
            HEADER
        ================================== */}

        <div className="admin-orders-header">

          <div>
            <span className="admin-orders-label">
              JEEVAN SANJIVANI
            </span>

            <h1>
              Orders
            </h1>

            <p>
              Manage and track all customer
              orders.
            </p>
          </div>


          <div className="admin-orders-header-right">

            <div className="orders-total-count">

              <Package size={19} />

              <span>
                {pagination.totalOrders}{" "}
                {pagination.totalOrders === 1
                  ? "Order"
                  : "Orders"}
              </span>

            </div>

            <button
              className="orders-refresh-btn"
              onClick={handleRefresh}
              title="Refresh orders"
            >
              <RefreshCw size={18} />
            </button>

          </div>

        </div>


        {/* ==================================
            CONTROLS
        ================================== */}

        <div className="admin-orders-controls">

          {/* SEARCH */}

          <div className="admin-orders-search">

            <Search size={19} />

            <input
              type="text"
              placeholder="Search by name, phone or order number..."
              value={search}
              onChange={handleSearch}
            />

          </div>


          {/* FILTERS */}

          <div className="admin-orders-filters">

            <div className="filter-select">

              <SlidersHorizontal size={17} />

              <select
                value={orderStatus}
                onChange={
                  handleOrderStatusChange
                }
              >
                <option value="">
                  All Orders
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Confirmed">
                  Confirmed
                </option>

                <option value="Processing">
                  Processing
                </option>

                <option value="Shipped">
                  Shipped
                </option>

                <option value="Delivered">
                  Delivered
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>

              </select>

            </div>


            <select
              value={paymentStatus}
              onChange={
                handlePaymentStatusChange
              }
            >
              <option value="">
                All Payments
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Paid">
                Paid
              </option>

            </select>


            <select
              value={paymentMethod}
              onChange={
                handlePaymentMethodChange
              }
            >
              <option value="">
                All Methods
              </option>

              <option value="COD">
                Cash on Delivery
              </option>

            </select>


            <select
              value={sort}
              onChange={handleSortChange}
            >
              <option value="latest">
                Latest
              </option>

              <option value="oldest">
                Oldest
              </option>

              <option value="amountLow">
                Amount: Low to High
              </option>

              <option value="amountHigh">
                Amount: High to Low
              </option>

            </select>


            <button
              className="clear-orders-filter"
              onClick={clearFilters}
            >
              Clear
            </button>

          </div>

        </div>


        {/* ==================================
            TABLE
        ================================== */}

        {orders.length === 0 ? (

          <div className="admin-orders-empty">

            <div className="empty-orders-icon">
              <Package size={40} />
            </div>

            <h2>
              No Orders Found
            </h2>

            <p>
              No orders match your current
              search or filters.
            </p>

            <button
              onClick={clearFilters}
            >
              Clear Filters
            </button>

          </div>

        ) : (

          <div className="admin-orders-table-wrapper">

            <table className="admin-orders-table">

              <thead>

                <tr>

                  <th>
                    Order
                  </th>

                  <th>
                    Customer
                  </th>

                  <th>
                    Items
                  </th>

                  <th>
                    Total
                  </th>

                  <th>
                    Payment
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {orders.map((order) => (

                  <tr key={order._id}>

                    {/* ORDER */}

                    <td>

                      <div className="admin-order-number">

                        <strong>
                          {order.orderNumber ||
                            `#${order._id.slice(-8)}`}
                        </strong>

                        <small>
                          ID:{" "}
                          {order._id.slice(-8)}
                        </small>

                      </div>

                    </td>


                    {/* CUSTOMER */}

                    <td>

                      <div className="admin-order-customer">

                        <strong>
                          {order.address
                            ?.fullName ||
                            "Unknown Customer"}
                        </strong>

                        <small>
                          {order.address
                            ?.phone ||
                            "No phone"}
                        </small>

                      </div>

                    </td>


                    {/* ITEMS */}

                    <td>

                      <div className="admin-order-items">

                        <strong>
                          {order.totalQuantity}
                        </strong>

                        <span>
                          {order.totalItems === 1
                            ? "Product"
                            : "Products"}
                        </span>

                      </div>

                    </td>


                    {/* TOTAL */}

                    <td>

                      <strong className="admin-order-total">
                        ₹{order.subtotal}
                      </strong>

                    </td>


                    {/* PAYMENT */}

                    <td>

                      <div className="admin-order-payment">

                        <strong>
                          {order.paymentMethod}
                        </strong>

                        <span
                          className={`payment-badge ${
                            order.paymentStatus?.toLowerCase()
                          }`}
                        >
                          {order.paymentStatus}
                        </span>

                      </div>

                    </td>


                    {/* STATUS */}

                    <td>

                      <span
                        className={`admin-order-status ${getStatusClass(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>

                    </td>


                    {/* DATE */}

                    <td>

                      <div className="admin-order-date">

                        <strong>
                          {formatDate(
                            order.createdAt
                          )}
                        </strong>

                        <span>
                          {formatTime(
                            order.createdAt
                          )}
                        </span>

                      </div>

                    </td>


                    {/* ACTION */}

                    <td>

                      <Link
                        to={`/admin/orders/${order._id}`}
                        className="admin-view-order-btn"
                      >
                        <Eye size={17} />
                        View
                      </Link>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}


        {/* ==================================
            PAGINATION
        ================================== */}

        {pagination.totalPages > 1 && (

          <div className="admin-orders-pagination">

            <button
              disabled={
                !pagination.hasPreviousPage
              }
              onClick={() =>
                setPage((prev) =>
                  Math.max(prev - 1, 1)
                )
              }
            >
              <ChevronLeft size={18} />

              Previous
            </button>


            <div className="pagination-info">

              <span>
                Page
              </span>

              <strong>
                {pagination.currentPage}
              </strong>

              <span>
                of
              </span>

              <strong>
                {pagination.totalPages}
              </strong>

            </div>


            <button
              disabled={
                !pagination.hasNextPage
              }
              onClick={() =>
                setPage((prev) =>
                  prev + 1
                )
              }
            >
              Next

              <ChevronRight size={18} />
            </button>

          </div>

        )}

      </Container>
    </section>
  );
};

export default AdminOrders;