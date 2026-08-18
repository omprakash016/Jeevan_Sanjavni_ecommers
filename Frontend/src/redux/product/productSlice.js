import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getProducts,
  getProductBySlug,
} from "../../services/productService";

import {
  createProduct,
  updateProduct,
  deleteProduct,
  restoreProduct,
} from "../../services/productService";

// ========================================
// GET ALL PRODUCTS
// ========================================

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",

  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await getProducts(params);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch products"
      );
    }
  }
);


// ========================================
// GET PRODUCT BY SLUG
// ========================================

export const fetchProductBySlug = createAsyncThunk(
  "products/fetchProductBySlug",

  async (slug, { rejectWithValue }) => {
    try {
      const response = await getProductBySlug(slug);

      return response.data.product;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch product"
      );
    }
  }
);

// ========================================
// CREATE PRODUCT
// ========================================

export const createNewProduct = createAsyncThunk(
  "products/createProduct",

  async (formData, { rejectWithValue }) => {
    try {
      const response = await createProduct(formData);

      return response.data.product;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create product"
      );
    }
  }
);


// ========================================
// UPDATE PRODUCT
// ========================================

export const updateExistingProduct = createAsyncThunk(
  "products/updateProduct",

  async (
    { productId, formData },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateProduct(
        productId,
        formData
      );

      return response.data.product;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update product"
      );
    }
  }
);


// ========================================
// DELETE PRODUCT
// ========================================

export const deleteExistingProduct = createAsyncThunk(
  "products/deleteProduct",

  async (productId, { rejectWithValue }) => {
    try {
      const response = await deleteProduct(productId);

      return {
        productId,
        message: response.message,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete product"
      );
    }
  }
);


// ========================================
// RESTORE PRODUCT
// ========================================

export const restoreExistingProduct = createAsyncThunk(
  "products/restoreProduct",

  async (productId, { rejectWithValue }) => {
    try {
      const response = await restoreProduct(productId);

      return response.data.product;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to restore product"
      );
    }
  }
);


const initialState = {
  products: [],

  selectedProduct: null,

  pagination: {
    totalProducts: 0,
    currentPage: 1,
    totalPages: 0,
    limit: 10,
  },

  loading: false,

  productLoading: false,

  error: null,
};


const productSlice = createSlice({
  name: "products",

  initialState,

  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },

    clearProductError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {

    // ========================================
    // FETCH PRODUCTS
    // ========================================

    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;

        state.products =
          action.payload.products || [];

        state.pagination =
          action.payload.pagination || state.pagination;
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload ||
          "Failed to fetch products";
      });


    // ========================================
    // FETCH SINGLE PRODUCT
    // ========================================

    builder
      .addCase(fetchProductBySlug.pending, (state) => {
        state.productLoading = true;
        state.error = null;
        state.selectedProduct = null;
      })

      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.productLoading = false;

        state.selectedProduct = action.payload;
      })

      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.productLoading = false;

        state.error =
          action.payload ||
          "Failed to fetch product";
      });

      // ========================================
// CREATE PRODUCT
// ========================================

builder
  .addCase(createNewProduct.pending, (state) => {
    state.loading = true;
    state.error = null;
  })

  .addCase(createNewProduct.fulfilled, (state, action) => {
    state.loading = false;

    if (action.payload) {
      state.products.unshift(action.payload);
    }
  })

  .addCase(createNewProduct.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  });


// ========================================
// UPDATE PRODUCT
// ========================================

builder
  .addCase(updateExistingProduct.pending, (state) => {
    state.loading = true;
    state.error = null;
  })

  .addCase(updateExistingProduct.fulfilled, (state, action) => {
    state.loading = false;

    const index = state.products.findIndex(
      (product) =>
        product._id === action.payload._id
    );

    if (index !== -1) {
      state.products[index] = action.payload;
    }

    state.selectedProduct = action.payload;
  })

  .addCase(updateExistingProduct.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  });


// ========================================
// DELETE PRODUCT
// ========================================

builder
  .addCase(deleteExistingProduct.pending, (state) => {
    state.loading = true;
    state.error = null;
  })

  .addCase(deleteExistingProduct.fulfilled, (state, action) => {
    state.loading = false;

    state.products = state.products.filter(
      (product) =>
        product._id !== action.payload.productId
    );
  })

  .addCase(deleteExistingProduct.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  });


// ========================================
// RESTORE PRODUCT
// ========================================

builder
  .addCase(restoreExistingProduct.pending, (state) => {
    state.loading = true;
    state.error = null;
  })

  .addCase(restoreExistingProduct.fulfilled, (state, action) => {
    state.loading = false;

    const index = state.products.findIndex(
      (product) =>
        product._id === action.payload._id
    );

    if (index !== -1) {
      state.products[index] = action.payload;
    } else {
      state.products.unshift(action.payload);
    }
  })

  .addCase(restoreExistingProduct.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  });
  },
});


export const {
  clearSelectedProduct,
  clearProductError,
} = productSlice.actions;


export default productSlice.reducer;