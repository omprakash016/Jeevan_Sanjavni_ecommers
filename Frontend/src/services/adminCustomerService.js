import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const getAllCustomers = async (params = {}) => {
  const response = await axios.get(
    `${API_URL}/admin/customers`,
    {
      params,
      withCredentials: true,
    }
  );

  return response.data;
};


const getAdminCustomerDetails = async (id) => {
  const response = await axios.get(
    `${API_URL}/admin/customers/${id}`,
    {
      withCredentials: true,
    }
  );

  return response.data;
};


const getCustomerOrders = async (id) => {
  const response = await axios.get(
    `${API_URL}/admin/customers/${id}/orders`,
    {
      withCredentials: true,
    }
  );

  return response.data;
};


export {
  getAllCustomers,
  getAdminCustomerDetails,
  getCustomerOrders,
};