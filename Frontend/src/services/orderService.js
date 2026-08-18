import api from "./api";


// ========================================
// PLACE ORDER
// ========================================

export const placeOrder = async (
  addressId
) => {

  const response = await api.post(
    "/orders",
    {
      addressId,
    }
  );

  return response.data;
};


// ========================================
// GET MY ORDERS
// ========================================

export const getMyOrders = async () => {

  const response = await api.get(
    "/orders"
  );

  return response.data;
};


// ========================================
// GET ORDER DETAILS
// ========================================

export const getOrderDetails = async (
  orderId
) => {

  const response = await api.get(
    `/orders/${orderId}`
  );

  return response.data;
};


// ========================================
// CANCEL ORDER
// ========================================

export const cancelOrder = async (orderId) => {

  const response = await api.patch(
    `/orders/${orderId}/cancel`
  );

  return response.data;
};