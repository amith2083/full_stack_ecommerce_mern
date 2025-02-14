import baseURL from "../../../utils/baseURL";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axios from "axios";
import axiosInstance from "../../../utils/axiosConfig";
import { resetError, resetSuccess } from "../../resetError/resetError";
//initalsState
const initialState = {
 orders: [],
  order: {},
  loading: false,
  error: null,
  isAdded: false,
  isUpdated: false,
  isDelete: false,
};
export const createOrder = createAsyncThunk(
  "/order/create",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    console.log("orderpayload", payload);
    try {
      const {
       orderItems,shippingAddress,totalPrice
      } = payload;
      console.log("orders",    orderItems,shippingAddress,totalPrice);
      


      const response = await axiosInstance.post(`/order`, { orderItems,shippingAddress,totalPrice});
      console.log("res", response.data);
      const orderId = response.data.orderId; // ✅ Store orderId before opening Razorpay
      console.log("orderId:", orderId);
      if (response.data.razorpayOrderId) {
        // Call Razorpay Modal
        const options = {
          key: response.data.key, // Razorpay Key ID
          amount: response.data.amount * 100, // Amount in paisa
          currency: "INR",
          name: "Madrid",
          description: "Order Payment",
          order_id: response.data.razorpayOrderId, // Razorpay Order ID
          handler: async function (response) {
            console.log("Payment Success:", response);
           try {
             // Call Backend API to verify the payment
            const verifyResponse = await axiosInstance.post(`/order/payment-verify`, {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              orderId:orderId,
            
              razorpay_signature: response.razorpay_signature,
            });
            //  Redirect based on payment verification
            if (verifyResponse.data.success) {
              alert("Payment Successful!");
              window.location.href = "/success"; // ✅ Redirect to success page
            } else {
              alert("Payment verification failed. Redirecting to orders.");
              window.location.href = "/orders"; //  Redirect to orders page
            }
            
           } catch (error) {
            console.error("Payment verification error:", error);
              alert("Payment verification failed. Redirecting to orders.");
              window.location.href = "/orders"; // ✅ Redirect to orders on error
            
           }

           

          
          },
          prefill: {
            name: "Test User",
            email: "testuser@example.com",
            contact: "9999999999",
          },
          theme: {
            color: "#F37254",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
      return response.data;
    } catch (error) {
      console.log(error);

      return rejectWithValue(error?.response?.data);
    }
  }
);

//fetching orders---------------------------------------------------------------------------------------------------------
export const fetchOrders= createAsyncThunk(
  "/orders/fetch",
  async (payload, { rejectWithValue, getState, dispatch }) => {
  ;
    try {
      const response = await axiosInstance.get(`/order`);
      console.log("res", response.data);
      return response.data;
    } catch (error) {
      console.log(error);

      return rejectWithValue(error?.response?.data);
    }
  }
);

//fetch singleProduct for product details page--------------------------------------------------------------------------------------
export const fetchOrder = createAsyncThunk(
  "/order/fetch",
  async (orderId, { rejectWithValue, getState, dispatch }) => {
    console.log("productid", orderIdId);
    try {
      const response = await axiosInstance.get(`/order/${orderId}`);
      console.log("response", response.data);
      return response.data;
    } catch (error) {
      console.log(error);

      return rejectWithValue(error?.response?.data);
    }
  }
);



const orderSlice = createSlice({
  name: "orders",
  initialState,
  extraReducers: (builder) => {
    //creation of products---------------------------------------------------------------------------------------------
    builder.addCase(createOrder.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.order = action.payload;
      state.isAdded = true;
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.loading = false;

      state.order = null;
      state.isAdded = false;
      state.error = action.payload;
    });
    //after sucess of product creation-------------------------------------------------------------------------------
    builder.addCase(resetSuccess.pending, (state, action) => {
      state.isAdded = false;
    });

    builder.addCase(resetError.pending, (state, action) => {
      state.error = null;
    });
    //fetching products------------------------------------------------------------------------------------------------
    builder.addCase(fetchOrders.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    
    });
    builder.addCase(fetchOrders.rejected, (state, action) => {
      state.loading = false;

      state.orders = null;
     
      state.error = action.payload;
    });
    //fetching single product-----------------------------------------------------------------------------------------
    builder.addCase(fetchOrder.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.order = action.payload;
      
    });
    builder.addCase(fetchOrder.rejected, (state, action) => {
      state.loading = false;

      state.order = null;
    
      state.error = action.payload;
    });
  },
});
const orderReducer = orderSlice.reducer;
export default orderReducer;
