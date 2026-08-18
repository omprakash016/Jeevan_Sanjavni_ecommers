import api from "./api";


// ========================================
// DASHBOARD SUMMARY
// ========================================

export const getDashboardSummary = async () => {
  const response = await api.get("/admin/dashboard");

  return response.data;
};


// ========================================
// RECENT ORDERS
// ========================================

export const getRecentOrders = async () => {
  const response = await api.get(
    "/admin/dashboard/recent-orders"
  );

  return response.data;
};


// ========================================
// SALES ANALYTICS
// ========================================

export const getSalesAnalytics = async () => {
  const response = await api.get(
    "/admin/dashboard/sales"
  );

  return response.data;
};


// ========================================
// TOP SELLING PRODUCTS
// ========================================

export const getTopSellingProducts = async () => {
  const response = await api.get(
    "/admin/dashboard/top-products"
  );

  return response.data;
};