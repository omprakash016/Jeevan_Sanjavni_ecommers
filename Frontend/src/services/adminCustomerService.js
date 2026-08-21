import api from "./api";

const getAllCustomers = async (params = {}) => {
  const response = await api.get("/admin/customers", { params });

  return response.data;
};


const getAdminCustomerDetails = async (id) => {
  const response = await api.get(`/admin/customers/${id}`);

  return response.data;
};


const getCustomerOrders = async (id) => {
  const response = await api.get(`/admin/customers/${id}/orders`);

  return response.data;
};


export {
  getAllCustomers,
  getAdminCustomerDetails,
  getCustomerOrders,
};