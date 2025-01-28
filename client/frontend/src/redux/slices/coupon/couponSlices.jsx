import baseURL from "../../../utils/baseURL";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axios from "axios";
import axiosInstance from "../../../utils/axiosConfig";
import { resetError, resetSuccess } from "../../resetError/resetError";
//initalsState
const initialState = {
  coupons: [],
  coupon: null,
  loading: false,
  error: null,
  isAdded: false,
  isUpdated: false,
  isDelete: false,
};

//create category---------------------------------------------------------------------------------------------------------
export const createCoupon = createAsyncThunk(
  "/coupon/create",
  async (
    { code, disscount, startDate, endDate },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      // const { name } = payload;

      const response = await axiosInstance.post(`/brand`, {
        code,
        disscount,
        startDate,
        endDate,
      });
      return response.data;
    } catch (error) {
      console.log(error);

      return rejectWithValue(error?.response?.data);
    }
  }
);
//fetch coupons--------------------------------------------------------------------------------------------------------------------
export const fetchCoupons = createAsyncThunk(
  "/coupons/fetch",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const response = await axiosInstance.get(`/coupon`);
      return response.data;
    } catch (error) {
      console.log(error);

      return rejectWithValue(error?.response?.data);
    }
  }
);
//fetch single coupon--------------------------------------------------------------------------------------------------------------------
export const fetchCoupon = createAsyncThunk(
  "/coupon/fetch",
  async (code, { rejectWithValue, getState, dispatch }) => {
    try {
      const response = await axiosInstance.get(`/coupon/single?code=${code}`);
      return response.data;
    } catch (error) {
      console.log(error);

      return rejectWithValue(error?.response?.data);
    }
  }
);

const couponSlice = createSlice({
  name: "coupon",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(createCoupon.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(createCoupon.fulfilled, (state, action) => {
      console.log("Payload:", action.payload);
      state.loading = false;
      state.coupon = action.payload;
      state.isAdded = true;
    });
    builder.addCase(createCoupon.rejected, (state, action) => {
      state.loading = false;
      state.coupon = null;
      state.isAdded = false;
      state.error = action.payload;
    });
    builder.addCase(fetchCoupons.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchCoupons.fulfilled, (state, action) => {
      state.loading = false;
      state.coupons = action.payload;
    });
    builder.addCase(fetchCoupons.rejected, (state, action) => {
      state.loading = false;
      state.coupons = null;
      state.error = action.payload;
    });
    //for single coupon-------------------------------------------------------------------------------------------------------
    builder.addCase(fetchCoupon.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchCoupon.fulfilled, (state, action) => {
      state.loading = false;
      state.coupon = action.payload;
      state.isAdded = true;
    });
    builder.addCase(fetchCoupon.rejected, (state, action) => {
      state.loading = false;
      state.coupon = null;
      state.error = action.payload;
      state.isAdded= false
    });
    //reset error action
    builder.addCase(resetError.pending, (state, action) => {
      state.isAdded = false;
      state.error = null;
    });
    //reset success action
    builder.addCase(resetSuccess.pending, (state, action) => {
      state.isAdded = false;
      state.error = null;
    });
  },
});
const couponReducer = couponSlice.reducer;
export default couponReducer;
