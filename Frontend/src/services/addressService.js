import api from "./api";

// ========================================
// GET ALL ADDRESSES
// ========================================

export const getAddresses = async () => {
  const response = await api.get("/addresses");

  return response.data;
};


// ========================================
// GET SINGLE ADDRESS
// ========================================

export const getAddressById = async (id) => {
  const response = await api.get(`/addresses/${id}`);

  return response.data;
};


// ========================================
// ADD ADDRESS
// ========================================

export const createAddress = async (addressData) => {
  const response = await api.post(
    "/addresses",
    addressData
  );

  return response.data;
};


// ========================================
// UPDATE ADDRESS
// ========================================

export const updateAddress = async (
  addressId,
  addressData
) => {
  const response = await api.patch(
    `/addresses/${addressId}`,
    addressData
  );

  return response.data;
};


// ========================================
// DELETE ADDRESS
// ========================================

export const deleteAddress = async (addressId) => {
  const response = await api.delete(
    `/addresses/${addressId}`
  );

  return response.data;
};


// ========================================
// SET DEFAULT ADDRESS
// ========================================

export const setDefaultAddress = async (
  addressId
) => {
  const response = await api.patch(
    `/addresses/${addressId}/default`
  );

  return response.data;
};



