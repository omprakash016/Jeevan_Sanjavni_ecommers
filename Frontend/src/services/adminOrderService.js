import api from "./api";

// ========================================
// GET ALL ADMIN ORDERS
// ========================================

export const getAdminOrders = async (params = {}) => {
  const response = await api.get("/admin/orders", {
    params,
  });

  return response.data;
};


// ========================================
// GET SINGLE ADMIN ORDER
// ========================================

export const getAdminOrderDetails = async (orderId) => {
  const response = await api.get(
    `/admin/orders/${orderId}`
  );

  return response.data;
};


// ========================================
// UPDATE ORDER STATUS
// ========================================

export const updateAdminOrderStatus = async (
  orderId,
  orderStatus,
  paymentStatus
) => {

  const data = {};

  if (orderStatus !== undefined) {
    data.orderStatus = orderStatus;
  }

  if (paymentStatus !== undefined) {
    data.paymentStatus = paymentStatus;
  }

  const response = await api.patch(
    `/admin/orders/${orderId}/status`,
    data
  );

  return response.data;
};