import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getCart,
  addToCart,
  updateCart,
  removeCartItem,
  clearCart,
} from "../../services/cartService";

// ================================
// GET CART
// ================================

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCart();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load cart"
      );
    }
  }
);

// ================================
// ADD TO CART
// ================================

export const addProductToCart = createAsyncThunk(
  "cart/addProduct",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      await addToCart(productId, quantity);

      const response = await getCart();

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to add product"
      );
    }
  }
);

// ================================
// UPDATE QUANTITY
// ================================

export const updateProductQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      await updateCart(productId, quantity);

      const response = await getCart();

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to update cart"
      );
    }
  }
);

// ================================
// REMOVE PRODUCT
// ================================

export const removeProduct = createAsyncThunk(
  "cart/removeProduct",
  async (productId, { rejectWithValue }) => {
    try {
      await removeCartItem(productId);

      const response = await getCart();

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to remove product"
      );
    }
  }
);

// ================================
// CLEAR CART
// ================================

export const clearUserCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      await clearCart();

      return {
        items: [],
        totalItems: 0,
        totalQuantity: 0,
        subtotal: 0,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to clear cart"
      );
    }
  }
);

const initialState = {
  items: [],
  totalItems: 0,
  totalQuantity: 0,
  subtotal: 0,

  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;

        state.items = action.payload.items;
        state.totalItems = action.payload.totalItems;
        state.totalQuantity = action.payload.totalQuantity;
        state.subtotal = action.payload.subtotal;
      })

      .addCase(addProductToCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalItems = action.payload.totalItems;
        state.totalQuantity = action.payload.totalQuantity;
        state.subtotal = action.payload.subtotal;
      })

      .addCase(updateProductQuantity.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalItems = action.payload.totalItems;
        state.totalQuantity = action.payload.totalQuantity;
        state.subtotal = action.payload.subtotal;
      })

      .addCase(removeProduct.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalItems = action.payload.totalItems;
        state.totalQuantity = action.payload.totalQuantity;
        state.subtotal = action.payload.subtotal;
      })

      .addCase(clearUserCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalItems = action.payload.totalItems;
        state.totalQuantity = action.payload.totalQuantity;
        state.subtotal = action.payload.subtotal;
      })

      .addMatcher(
        (action) => action.type.startsWith("cart/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export default cartSlice.reducer;