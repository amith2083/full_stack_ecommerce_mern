import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axios from "axios";
import axiosInstance from "../../../utils/axiosConfig";
import { resetError, resetSuccess } from "../../resetError/resetError";
import { CornerDownLeft } from "lucide-react";
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
  updated: false,
  isDelete: false,
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
    console.log("sliceverify", email, otp);
    try {
      const response = await axiosInstance.post(`/user/verify-otp`, {
        email,
        otp,
      });
      console.log("verifyres", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const resendOtp = createAsyncThunk(
  "user/resendOtp",
  async ({ email }, { rejectWithValue }) => {
    
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
    
     
      const response = await axiosInstance.post(`/user/login`, {
        email,
        password,
      });
    

      Cookies.set("user", JSON.stringify(response.data), { expires: 7 });
   
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
    console.log(
      "updateshipping",
      firstName,
      lastName,
      address,
      city,
      postalCode,
      phone,
      country
    );
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
      console.log("update", response.data);
      // Store user info in cookies
      // Cookies.set('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.log(error);

      return rejectWithValue(error?.response?.data);
    }
  }
);
// Update shipping address
export const updateUserShippingAddress = createAsyncThunk(
  "user/updateAddress",
  async ({ addressId, updatedAddress }, { rejectWithValue }) => {
    try {
      console.log("addressid", addressId);
      console.log("updateaddress", updatedAddress);
      const response = await axiosInstance.put(
        `/user/profile/shippingaddress/${addressId}`,
        updatedAddress
      );
      console.log("data", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//delete user shipping address
export const deleteUserShippingAddress = createAsyncThunk(
  "user/deleteAddress",
  async ({ addressId }, { rejectWithValue }) => {
    try {
      console.log("Deleting address:", addressId);
      const response = await axiosInstance.delete(
        `/user/profile/shippingaddress/${addressId}`
      );
      console.log("Delete response:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getUser = createAsyncThunk(
  "user/getuser",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const response = await axiosInstance.get(`/user/profile`, {});

      // Store user info in cookies
      // Cookies.set('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.log(error);

      return rejectWithValue(error?.response?.data);
    }
  }
);
export const getAllUsers = createAsyncThunk(
  "user/getallusesr",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const response = await axiosInstance.get(`/user/all`, {});

      // Store user info in cookies
      // Cookies.set('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.log(error);

      return rejectWithValue(error?.response?.data);
    }
  }
);
//user block & unblock--------------------------------------------------------------------------------------------------------------------

export const toggleBlockUser = createAsyncThunk("users/toggleBlockUser", async (userId, { rejectWithValue, getState, dispatch  }) => {
  try {
    const response = await axiosInstance.put(`/user/block-unblock/${userId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});


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
    builder.addCase(updateUserShippingAddress.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateUserShippingAddress.fulfilled, (state, action) => {
      state.profile = action.payload;
      state.loading = false;
      state.updated = true;
    });
    builder.addCase(updateUserShippingAddress.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
    builder.addCase(deleteUserShippingAddress.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(deleteUserShippingAddress.fulfilled, (state, action) => {
      state.profile = action.payload;
      state.loading = false;
      state.isDelete = true;
    });
    builder.addCase(deleteUserShippingAddress.rejected, (state, action) => {
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
    builder.addCase(getAllUsers.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getAllUsers.fulfilled, (state, action) => {
      state.users = action.payload.users;
      state.loading = false;
    });
    builder.addCase(getAllUsers.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
    builder.addCase(toggleBlockUser.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(toggleBlockUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
    });
    builder.addCase(toggleBlockUser.rejected, (state, action) => {
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
    builder.addCase(resetSuccess.pending, (state) => {
      state.updated = false;
      state.isDelete = false;
    });
  },
});

const userReducer = userSlice.reducer;
export default userReducer;
