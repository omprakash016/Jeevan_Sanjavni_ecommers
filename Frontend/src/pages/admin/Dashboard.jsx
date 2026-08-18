import { useCallback, useEffect, useState } from "react";

import {
  IndianRupee,
  ShoppingBag,
  Users,
  Package,
  Clock3,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  Trophy,
} from "lucide-react";

import { toast } from "react-toastify";

import Container from "../../component/ui/Container";

import {
  getDashboardSummary,
  getRecentOrders,
  getSalesAnalytics,
  getTopSellingProducts,
} from "../../services/adminService";

import "./Dashboard.css";


const Dashboard = () => {

  // ========================================
  // STATE
  // ========================================

  const [summary, setSummary] = useState(null);

  const [recentOrders, setRecentOrders] = useState([]);

  const [sales, setSales] = useState(null);

  const [topProducts, setTopProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");


  // ========================================
  // FETCH DASHBOARD
  // ========================================

  const fetchDashboard = useCallback(
    async (isRefresh = false) => {

      try {

        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");


        const [
          summaryResponse,
          recentOrdersResponse,
          salesResponse,
          topProductsResponse,
        ] = await Promise.all([

          getDashboardSummary(),

          getRecentOrders(),

          getSalesAnalytics(),

          getTopSellingProducts(),

        ]);


        // Summary

        if (summaryResponse?.success) {

          setSummary(
            summaryResponse.data
          );

        }


        // Recent Orders

        if (recentOrdersResponse?.success) {

          setRecentOrders(
            recentOrdersResponse.data
              ?.recentOrders || []
          );

        }


        // Sales

        if (salesResponse?.success) {

          setSales(
            salesResponse.data
          );

        }


        // Top Products

        if (topProductsResponse?.success) {

          setTopProducts(
            topProductsResponse.data
              ?.topProducts || []
          );

        }

      } catch (err) {

        console.error(
          "Dashboard Error:",
          err
        );

        const message =
          err.response?.data?.message ||
          "Failed to load dashboard data";

        setError(message);

        toast.error(message);

      } finally {

        setLoading(false);

        setRefreshing(false);

      }

    },
    []
  );


  useEffect(() => {

    fetchDashboard();

  }, [fetchDashboard]);


  // ========================================
  // HELPERS
  // ========================================

  const formatCurrency = (value = 0) => {

    return `₹${Number(value).toLocaleString(
      "en-IN"
    )}`;

  };


  const formatDate = (date) => {

    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };


  const getStatusClass = (status) => {

    switch (status) {

      case "Pending":
        return "pending";

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
  // SALES DATA
  // ========================================

  const monthlySales =
    sales?.monthlySales || [];

  const yearlySales =
    sales?.yearlySales || [];

  const dailySales =
    sales?.dailySales || [];


  /*
    We display monthly sales by default.
  */

  const chartData =
    monthlySales.length > 0
      ? monthlySales
      : dailySales.length > 0
      ? dailySales
      : yearlySales;


  const getSaleValue = (item) => {

    return Number(
      item.totalSales ??
      item.revenue ??
      item.total ??
      0
    );

  };


  const getSaleLabel = (item) => {

    return (
      item.month ||
      item.date ||
      item.year ||
      item._id ||
      "—"
    );

  };


  const maxSale = Math.max(
    ...chartData.map(getSaleValue),
    1
  );


  // ========================================
  // LOADING
  // ========================================

  if (loading) {

    return (

      <section className="admin-dashboard-page">

        <Container>

          <div className="dashboard-loading">

            <RefreshCw
              size={38}
              className="spin"
            />

            <h2>
              Loading Dashboard...
            </h2>

            <p>
              Please wait while we fetch
              your dashboard data.
            </p>

          </div>

        </Container>

      </section>

    );

  }


  // ========================================
  // DASHBOARD
  // ========================================

  return (

    <section className="admin-dashboard-page">

      <Container>


        {/* ==================================
            HEADER
        ================================== */}

        <div className="dashboard-header">

          <div>

            <span className="dashboard-label">
              ADMIN PANEL
            </span>

            <h1>
              Dashboard
            </h1>

            <p>
              Overview of your Jeevan
              Sanjivani store.
            </p>

          </div>


          <button
            className="dashboard-refresh-btn"
            onClick={() =>
              fetchDashboard(true)
            }
            disabled={refreshing}
          >

            <RefreshCw
              size={17}
              className={
                refreshing
                  ? "spin"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}

          </button>

        </div>


        {/* ==================================
            ERROR
        ================================== */}

        {error && (

          <div className="dashboard-error">

            <AlertTriangle
              size={18}
            />

            <span>
              {error}
            </span>

          </div>

        )}


        {/* ==================================
            SUMMARY CARDS
        ================================== */}

        <div className="dashboard-summary-grid">


          {/* Revenue */}

          <div className="dashboard-stat-card revenue">

            <div className="stat-card-icon">

              <IndianRupee
                size={21}
              />

            </div>

            <div className="stat-card-content">

              <span>
                Total Revenue
              </span>

              <strong>
                {formatCurrency(
                  summary?.totalRevenue
                )}
              </strong>

              <small>
                From delivered orders
              </small>

            </div>

          </div>


          {/* Orders */}

          <div className="dashboard-stat-card orders">

            <div className="stat-card-icon">

              <ShoppingBag
                size={21}
              />

            </div>

            <div className="stat-card-content">

              <span>
                Total Orders
              </span>

              <strong>
                {summary?.totalOrders || 0}
              </strong>

              <small>
                All customer orders
              </small>

            </div>

          </div>


          {/* Customers */}

          <div className="dashboard-stat-card customers">

            <div className="stat-card-icon">

              <Users
                size={21}
              />

            </div>

            <div className="stat-card-content">

              <span>
                Customers
              </span>

              <strong>
                {summary?.totalUsers || 0}
              </strong>

              <small>
                Registered users
              </small>

            </div>

          </div>


          {/* Products */}

          <div className="dashboard-stat-card products">

            <div className="stat-card-icon">

              <Package
                size={21}
              />

            </div>

            <div className="stat-card-content">

              <span>
                Products
              </span>

              <strong>
                {summary?.totalProducts || 0}
              </strong>

              <small>
                Active products
              </small>

            </div>

          </div>


        </div>


        {/* ==================================
            ORDER OVERVIEW
        ================================== */}

        <div className="dashboard-order-overview">


          <div className="overview-item">

            <div className="overview-icon pending">

              <Clock3 size={19} />

            </div>

            <div>

              <span>
                Pending Orders
              </span>

              <strong>
                {summary?.pendingOrders || 0}
              </strong>

            </div>

          </div>


          <div className="overview-item">

            <div className="overview-icon completed">

              <CheckCircle2 size={19} />

            </div>

            <div>

              <span>
                Completed Orders
              </span>

              <strong>
                {summary?.completedOrders || 0}
              </strong>

            </div>

          </div>


          <div className="overview-item">

            <div className="overview-icon cancelled">

              <XCircle size={19} />

            </div>

            <div>

              <span>
                Cancelled Orders
              </span>

              <strong>
                {summary?.cancelledOrders || 0}
              </strong>

            </div>

          </div>


          <div className="overview-item">

            <div className="overview-icon low-stock">

              <AlertTriangle size={19} />

            </div>

            <div>

              <span>
                Low Stock
              </span>

              <strong>
                {summary?.lowStockProducts || 0}
              </strong>

            </div>

          </div>


        </div>


        {/* ==================================
            SALES + TOP PRODUCTS
        ================================== */}

        <div className="dashboard-main-grid">


          {/* SALES */}

          <div className="dashboard-card sales-card">

            <div className="dashboard-card-header">

              <div className="dashboard-card-title">

                <div className="card-heading-icon">

                  <TrendingUp size={18} />

                </div>

                <div>

                  <h2>
                    Sales Analytics
                  </h2>

                  <span>
                    Monthly sales overview
                  </span>

                </div>

              </div>

            </div>


            {chartData.length === 0 ? (

              <div className="dashboard-empty">

                <TrendingUp size={32} />

                <p>
                  No sales data available.
                </p>

              </div>

            ) : (

              <div className="sales-chart">

                {chartData.map(
                  (item, index) => {

                    const value =
                      getSaleValue(item);

                    const height =
                      Math.max(
                        (value /
                          maxSale) *
                          100,
                        5
                      );

                    return (

                      <div
                        className="chart-column"
                        key={
                          item._id ||
                          index
                        }
                      >

                        <div className="chart-value">

                          {formatCurrency(
                            value
                          )}

                        </div>


                        <div className="chart-bar-wrapper">

                          <div
                            className="chart-bar"
                            style={{
                              height: `${height}%`,
                            }}
                            title={formatCurrency(
                              value
                            )}
                          />

                        </div>


                        <span className="chart-label">

                          {getSaleLabel(
                            item
                          )}

                        </span>

                      </div>

                    );

                  }
                )}

              </div>

            )}

          </div>


          {/* TOP PRODUCTS */}

          <div className="dashboard-card top-products-card">

            <div className="dashboard-card-header">

              <div className="dashboard-card-title">

                <div className="card-heading-icon">

                  <Trophy size={18} />

                </div>

                <div>

                  <h2>
                    Top Products
                  </h2>

                  <span>
                    Best selling products
                  </span>

                </div>

              </div>

            </div>


            {topProducts.length === 0 ? (

              <div className="dashboard-empty">

                <Package size={32} />

                <p>
                  No product sales yet.
                </p>

              </div>

            ) : (

              <div className="top-products-list">

                {topProducts
                  .slice(0, 5)
                  .map(
                    (product, index) => (

                      <div
                        className="top-product-item"
                        key={
                          product._id ||
                          index
                        }
                      >

                        <div className="top-product-rank">

                          {index + 1}

                        </div>


                        <div className="top-product-image">

                          {product.image ? (

                            <img
                              src={
                                product.image
                              }
                              alt={
                                product.name
                              }
                            />

                          ) : (

                            <Package
                              size={19}
                            />

                          )}

                        </div>


                        <div className="top-product-info">

                          <strong>

                            {product.name ||
                              "Product"}

                          </strong>

                          <span>

                            {product.totalSold ??
                              product.quantity ??
                              0}{" "}

                            sold

                          </span>

                        </div>


                        <div className="top-product-sales">

                          {formatCurrency(
                            product.totalSales ??
                              product.revenue ??
                              0
                          )}

                        </div>

                      </div>

                    )
                  )}

              </div>

            )}

          </div>

        </div>


        {/* ==================================
            RECENT ORDERS
        ================================== */}

        <div className="dashboard-card recent-orders-card">

          <div className="dashboard-card-header">

            <div className="dashboard-card-title">

              <div className="card-heading-icon">

                <ShoppingBag size={18} />

              </div>

              <div>

                <h2>
                  Recent Orders
                </h2>

                <span>
                  Latest customer orders
                </span>

              </div>

            </div>

          </div>


          {recentOrders.length === 0 ? (

            <div className="dashboard-empty">

              <ShoppingBag size={32} />

              <p>
                No recent orders found.
              </p>

            </div>

          ) : (

            <div className="recent-orders-table-wrapper">

              <table className="recent-orders-table">

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
                      Amount
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Date
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {recentOrders
                    .slice(0, 8)
                    .map(
                      (order, index) => (

                        <tr
                          key={
                            order._id ||
                            index
                          }
                        >

                          <td>

                            <strong>

                              {order.orderNumber ||
                                `#${order._id?.slice(
                                  -8
                                )}`}

                            </strong>

                          </td>


                          <td>

                            <div className="dashboard-customer">

                              <span>

                                {order.user
                                  ?.name ||
                                  order.user
                                    ?.fullName ||
                                  order.address
                                    ?.fullName ||
                                  "Customer"}

                              </span>

                            </div>

                          </td>


                          <td>

                            {order.totalQuantity ??
                              order.totalItems ??
                              0}

                          </td>


                          <td>

                            <strong>

                              {formatCurrency(
                                order.subtotal
                              )}

                            </strong>

                          </td>


                          <td>

                            <span
                              className={`dashboard-order-status ${getStatusClass(
                                order.orderStatus
                              )}`}
                            >

                              {
                                order.orderStatus
                              }

                            </span>

                          </td>


                          <td>

                            {formatDate(
                              order.createdAt
                            )}

                          </td>

                        </tr>

                      )
                    )}

                </tbody>

              </table>

            </div>

          )}

        </div>


      </Container>

    </section>

  );

};


export default Dashboard;