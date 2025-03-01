import baseURL from "../../../utils/baseURL";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axios from "axios";
import axiosInstance from "../../../utils/axiosConfig";
import { resetError, resetSuccess } from "../../resetError/resetError";
//initalsState
const initialState = {
    wishLists: [],
    wishList:null,
   
    loading: false,
    error: null,
    isAdded: false,
    
    isDelete: false,
  };
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/wishlist");
      console.log('reswishlist',response.data)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`wishlist/add/${productId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
export const removeFromWishlist = createAsyncThunk(
    "wishlist/removeFromWishlist",
    async (productId, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.delete(`/wishlist/remove/${productId}`);
        return response.data
      } catch (error) {
        return rejectWithValue(error.response.data.message);
      }
    }
  );
  

const wishListSlice = createSlice({
    name: "wishLists",
    initialState,
    extraReducers: (builder) => {
      //creation of products---------------------------------------------------------------------------------------------
      builder.addCase(addToWishlist.pending, (state, action) => {
        state.loading = true;
      });
      builder.addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishList = action.payload;
        state.isAdded = true;
      });
      builder.addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
  
        state.wishList = null;
        state.isAdded = false;
        state.error = action.payload;
      });
      builder.addCase(fetchWishlist.pending, (state, action) => {
        state.loading = true;
      });
      builder.addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishLists = action.payload.products;
        console.log('slice',state.wishLists)
      
      });
      builder.addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
  
        state.wishList = null;
     
        state.error = action.payload;
      });
      builder.addCase(removeFromWishlist.pending, (state, action) => {
        state.loading = true;
      });
      builder.addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.isDelete =true
      
      });
      builder.addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
     
        state.error = action.payload;
      });
       //after sucess of adding items to wishlist-------------------------------------------------------------------------------
    builder.addCase(resetSuccess.pending, (state, action) => {
        state.isAdded = false;
        state.isDelete= false
      });
  
      builder.addCase(resetError.pending, (state, action) => {
        state.error = null;
      });
    }
});
const wishListReducer = wishListSlice.reducer;
export default wishListReducer;