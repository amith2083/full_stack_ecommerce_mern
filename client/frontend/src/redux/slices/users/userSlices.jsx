import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axios from "axios";
// import baseURL from '../../../utils/baseURL';
import axiosInstance from "../../../utils/axiosConfig";
import { resetError } from "../../resetError/resetError";
const initialState = {
  loading: false,
  error: null,
  users: [],
  user: null,
  profile: {},
  userAuth: {
    loading: false,
    error: null,
    userInfo: {},
  },
};
export const registerUserAction = createAsyncThunk(
  "user/register",
  async (
    { email, password, name },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      console.log("Login Payload:", { email, password, name });
      const response = await axiosInstance.post(`/user/register`, {
        email,
        password,
        name,
      });
      console.log(response.data);
      // Store user info in cookies
      // Cookies.set('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.log(error);

      return rejectWithValue(error?.response?.data);
    }
  }
);
export const verifyOtp = createAsyncThunk(
  "user/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    console.log('verify',email,otp)
    try {
      const response = await axiosInstance.post(`/user/verify-otp`, { email, otp });
      console.log('verifyres',response)
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const resendOtp = createAsyncThunk(
  "user/resendOtp",
  async ({ email }, { rejectWithValue }) => {
    console.log("Resend OTP for:", email);
    try {
      const response = await axiosInstance.post(`/user/resend-otp`, { email });
      console.log("Resend OTP Response:", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);




export const loginUserAction = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue, getState, dispatch }) => {
    try {
      console.log("Login Payload:", { email, password });
      const token = getState()?.users?.userAuth?.userInfo?.token;
      console.log("token", token);
      //         const token = getState()?.users?.userAuth?.userInfo?.token;
      //   console.log("Token from Redux state:", token); // Debugging log
      //   const config = {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       "Content-Type": "multipart/form-data",
      //     },
      //   };
      const response = await axiosInstance.post(`/user/login`, {
        email,
        password,
      });
      console.log(response.data);
      // Store user info in cookies

      Cookies.set("user", JSON.stringify(response.data), { expires: 7 });
      // Store the token in cookies
      //   Cookies.set('token', response.data.token, { expires: 7 }); // Expires in 7 days
      return response.data;
    } catch (error) {
      console.log(error);

      return rejectWithValue(error?.response?.data);
    }
  }
);
export const updateShippingAddress = createAsyncThunk(
  "user/updateshippingaddress",
  async (
    { firstName, lastName, address, city, postalCode, phone, country },
    { rejectWithValue, getState, dispatch }
  ) => {
    console.log('updateshipping',firstName, lastName, address, city, postalCode, phone, country)
    try {
      const response = await axiosInstance.put(`/user/update/address`, {
        firstName,
        lastName,
        address,
        city,
        postalCode,
        phone,
        country,
      });
      console.log('update',response.data);
      // Store user info in cookies
      // Cookies.set('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.log(error);

      return rejectWithValue(error?.response?.data);
    }
  }
);
export const getUser = createAsyncThunk(
    "user/getuser",
    async (
      payloaad,
      { rejectWithValue, getState, dispatch }
    ) => {
      try {
        const response = await axiosInstance.get(`/user/profile`, {
         
        });
        console.log(response.data);
        // Store user info in cookies
        // Cookies.set('user', JSON.stringify(response.data));
        return response.data;
      } catch (error) {
        console.log(error);
  
        return rejectWithValue(error?.response?.data);
      }
    }
  );

//logout action
export const logoutAction = createAsyncThunk(
  "users/logout",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    Cookies.remove("user");
    return true;
  }
);
//usersSlice
const userSlice = createSlice({
  name: "users",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(registerUserAction.pending, (state, action) => {
        state.loading = true;
      });
      builder.addCase(registerUserAction.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      });
      builder.addCase(registerUserAction.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
    builder.addCase(loginUserAction.pending, (state, action) => {
      state.userAuth.loading = true;
    });
    builder.addCase(loginUserAction.fulfilled, (state, action) => {
      state.userAuth.userInfo = action.payload;
      state.userAuth.loading = false;
    });
    builder.addCase(loginUserAction.rejected, (state, action) => {
      state.userAuth.error = action.payload;
      state.userAuth.loading = false;
    });
    builder.addCase(updateShippingAddress.pending, (state, action) => {
        state.loading = true;
      });
      builder.addCase(updateShippingAddress.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      });
      builder.addCase(updateShippingAddress.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
      builder.addCase(getUser.pending, (state, action) => {
        state.loading = true;
      });
      builder.addCase(getUser.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      });
      builder.addCase(getUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
   
    builder.addCase(logoutAction.fulfilled, (state) => {
      state.userAuth.userInfo = {};
    });
    //reset error action
    builder.addCase(resetError.pending, (state) => {
      state.error = null;
      state.userAuth.error = null;
    });
  },
});

const userReducer = userSlice.reducer;
export default userReducer;
