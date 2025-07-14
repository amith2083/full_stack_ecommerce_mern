import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosConfig";

// Initial state
const initialState = {
  cartItems: [],
  loading: false,
  error: null,
  isAdded: false,
  isUpdated: false,
  isDeleted: false,
};

// Add product to cart
export const addOrderToCart = createAsyncThunk(
  "cart/add-to-cart",
  async ({ id, selectedSize, selectedColor }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/cart/${id}`, {
        size: selectedSize,
        color: selectedColor,
      });

      return response.data; // Assume the API returns the updated cart
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch cart items
export const getCartItemsFromDatabase = createAsyncThunk(
  "cart/get-cart-items",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/cart");

      return response.data; // Assume the API returns the cart items
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Change item quantity
export const changeOrderItemQty = createAsyncThunk(
  "cart/change-item-qty",
  async ({ productId, qty }, { rejectWithValue }) => {
    console.log("productid&qty", productId, qty);
    try {
      const response = await axiosInstance.put(`/cart/${productId}`, { qty });

      return response.data; // Assume the API returns the updated cart
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Remove item from cart
export const removeOrderItem = createAsyncThunk(
  "cart/removeOrderItem",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/cart/${productId}`);
      return response.data; // Assume the API returns the updated cart
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  extraReducers: (builder) => {
    // Add to cart
    builder.addCase(addOrderToCart.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addOrderToCart.fulfilled, (state, action) => {
      state.loading = false;
      state.cartItems = action.payload.cartItems;
      state.isAdded = true;
    });
    builder.addCase(addOrderToCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAdded = false;
    });

    // Fetch cart items
    builder.addCase(getCartItemsFromDatabase.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getCartItemsFromDatabase.fulfilled, (state, action) => {
      state.loading = false;
      state.cartItems = action.payload.cartItems;
      console.log("state", state.cartItems);
    });
    builder.addCase(getCartItemsFromDatabase.rejected, (state, action) => {
      state.loading = false;
      //   state.cartItems = [];
      state.error = action.payload;
    });

    // Change item quantity
    builder.addCase(changeOrderItemQty.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(changeOrderItemQty.fulfilled, (state, action) => {
      state.loading = false;
      console.log("before", state.cartItems);

      //    console.log(action.payload.cartItems)
      //   state.cartItems = action.payload.cartItems;
      console.log("after", state.cartItems);
      state.isUpdated = true;
    });
    builder.addCase(changeOrderItemQty.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isUpdated = false;
    });

    // Remove item
    builder.addCase(removeOrderItem.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(removeOrderItem.fulfilled, (state, action) => {
      state.loading = false;
      //   state.cartItems = action.payload;
      state.isDeleted = true;
    });
    builder.addCase(removeOrderItem.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isDeleted = false;
    });
  },
});

// Generate the reducer
const cartReducer = cartSlice.reducer;

export default cartReducer;
