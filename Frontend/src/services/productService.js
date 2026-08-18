import api from "./api";

// ========================================
// GET ALL PRODUCTS
// ========================================

export const getProducts = async (params = {}) => {
  const response = await api.get("/products", {
    params,
  });

  return response.data;
};


// ========================================
// GET PRODUCT BY SLUG
// ========================================

export const getProductBySlug = async (slug) => {
  const response = await api.get(`/products/${slug}`);

  return response.data;
};


// ========================================
// CREATE PRODUCT
// ========================================

export const createProduct = async (formData) => {
  const response = await api.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};


// ========================================
// UPDATE PRODUCT
// ========================================

export const updateProduct = async (productId, formData) => {
  const response = await api.put(
    `/products/${productId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};


// ========================================
// DELETE PRODUCT
// ========================================

export const deleteProduct = async (productId) => {
  const response = await api.delete(
    `/products/${productId}`
  );

  return response.data;
};


// ========================================
// RESTORE PRODUCT
// ========================================

export const restoreProduct = async (productId) => {
  const response = await api.patch(
    `/products/${productId}/restore`
  );

  return response.data;
};