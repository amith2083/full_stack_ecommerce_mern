import baseURL from "../../../utils/baseURL";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axios from "axios";
import axiosInstance from "../../../utils/axiosConfig";
import { resetError, resetSuccess } from "../../resetError/resetError";
import { openRazorpayModal } from "../../../utils/openRazorpayModal";
import Swal from "sweetalert2";
//initalsState
const initialState = {
 orders: [],
  order: {},
  loading: false,
  error: null,
  isAdded: false,
  isUpdated: false,
  isDelete: false,
  stats:null
};
// export const createOrder = createAsyncThunk(
 
//   "/order/create",
//   async (payload, { rejectWithValue, getState, dispatch }) => {
//     console.log("orderpayload", payload);
//     try {
//       const {
//        orderItems,shippingAddress,totalPrice,navigate
//       } = payload;
//       console.log("orders",    orderItems,shippingAddress,totalPrice);
      


//       const response = await axiosInstance.post(`/order`, { orderItems,shippingAddress,totalPrice,navigate});
//       console.log("res", response.data);
//       const orderId = response.data.orderId; // ✅ Store orderId before opening Razorpay
//       console.log("orderId:", orderId);
//       const navigater = response.data.navigate
//       if (response.data.razorpayOrderId) { 
//         // Call Razorpay Modal
//         const options = {
//           key: response.data.key, // Razorpay Key ID
//           amount: response.data.amount * 100, // Amount in paisa
//           currency: "INR",
//           name: "TrendzCart",
//           description: "Order Payment",
//           order_id: response.data.razorpayOrderId, // Razorpay Order ID
//           handler: async function (response) {
//             console.log("Payment Success:", response);
//            try {
//              // Call Backend API to verify the payment
//             const verifyResponse = await axiosInstance.post(`/order/payment-verify`, {
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_order_id: response.razorpay_order_id,
//               orderId:orderId,
//               navigate:navigater,
            
//               razorpay_signature: response.razorpay_signature,
//             });
//             //  Redirect based on payment verification
//             if (verifyResponse.data.success) {
//               // alert("Payment Successful!");
//               // window.location.href = "/success"; // ✅ Redirect to success page
//               navigate('/success')

//             } else {
//               // alert("Payment verification failed. Redirecting to orders.");
//               // window.location.href = "/orders"; //  Redirect to orders page
//               navigate('/orders')
//             }
            
//            } catch (error) {
//             console.error("Payment verification error:", error);
//               alert("Payment verification failed. Redirecting to orders.");
//               // window.location.href = "/orders";
//               navigate('/user-profile/orders') // ✅ Redirect to orders on error
            
//            }

           

          
//           },
//           prefill: {
//             name: "Test User",
//             email: "testuser@example.com",
//             contact: "9999999999",
//           },
//           theme: {
//             color: "#F37254",
//           },
//           modal: {
//             escape: false,
//             ondismiss: async function () {
//               console.log("User closed the Razorpay modal.");
        
//               // ✅ Update order payment status to 'Failed'
//               try {
//                 await axiosInstance.post(`/order/payment-failed`, { orderId });
//                 alert("Payment was not completed. Order marked as failed.");
//               } catch (error) {
//                 console.error("Error updating payment status:", error);
//               }
        
//               navigate('/user-profile/orders'); // Redirect to orders page
//             },
//           },
          
//         };

//         const rzp = new window.Razorpay(options);
//         rzp.open();
//       }
//       return response.data;
//     } catch (error) {
//       console.log(error);

//       return rejectWithValue(error?.response?.data);
//     }
//   }
// );
export const createOrder = createAsyncThunk(
  "/order/create",
  async (payload, { rejectWithValue }) => {
    try {
      const { orderItems, shippingAddress, totalPrice, navigate,paymentMethod } = payload;

      const response = await axiosInstance.post(`/order`, { orderItems, shippingAddress, totalPrice,paymentMethod });
      console.log("Order Response:", response.data);

      if (response.data.razorpayOrderId) {
        openRazorpayModal({
          key: response.data.key,
          amount: response.data.amount,
          order_id: response.data.razorpayOrderId,
          orderId:response.data.orderId,
          navigate
        });
      }else{
        Swal.fire({
          icon: "success",
          title: "Payment Successful",
          text:  "Your order has been placed successfully!",
          timer: 3000, // Auto-close after 3 seconds
          showConfirmButton: false,
        }).then(() => {
          navigate( '/success');
        });
      }
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const retryPayment = createAsyncThunk(
  "/order/retry-payment",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    console.log("orderpayload", payload);
    try {
      const{orderId,totalPrice,navigate}=payload
      
      


      const response = await axiosInstance.post(`/order/retry-payment`, { orderId,totalPrice});
      console.log("res", response.data);
      // const orderId = response.data.orderId; // ✅ Store orderId before opening Razorpay
      
      // const navigater = response.data.navigate
      // if (response.data.razorpayOrderId) { 
      //   // Call Razorpay Modal
      //   const options = {
      //     key: response.data.key, // Razorpay Key ID
      //     amount: response.data.amount * 100, // Amount in paisa
      //     currency: "INR",
      //     name: "TrendzCart",
      //     description: "Order Payment",
      //     order_id: response.data.razorpayOrderId, // Razorpay Order ID
      //     handler: async function (response) {
      //       console.log("Payment Success:", response);
      //      try {
      //        // Call Backend API to verify the payment
      //       const verifyResponse = await axiosInstance.post(`/order/payment-verify`, {
      //         razorpay_payment_id: response.razorpay_payment_id,
      //         razorpay_order_id: response.razorpay_order_id,
      //         orderId:orderId,
      //         // navigate:navigater,
            
      //         razorpay_signature: response.razorpay_signature,
      //       });
      //       //  Redirect based on payment verification
      //       if (verifyResponse.data.success) {
      //         // alert("Payment Successful!");
      //         // window.location.href = "/success"; // ✅ Redirect to success page
      //         navigate('/success')

      //       } else {
      //         // alert("Payment verification failed. Redirecting to orders.");
      //         // window.location.href = "/orders"; //  Redirect to orders page
      //         navigate('/user-profile/orders')
      //       }
            
      //      } catch (error) {
      //       console.error("Payment verification error:", error);
      //         alert("Payment verification failed. Redirecting to orders.");
      //         // window.location.href = "/orders";
      //         navigate('/user-profile/orders') // ✅ Redirect to orders on error
            
      //      }

           

          
      //     },
      //     prefill: {
      //       name: "Test User",
      //       email: "testuser@example.com",
      //       contact: "9999999999",
      //     },
      //     theme: {
      //       color: "#F37254",
      //     },
      //     modal: {
      //       escape: false,
      //       ondismiss: async function () {
      //         console.log("User closed the Razorpay modal.");
        
      //         // ✅ Update order payment status to 'Failed'
      //         try {
      //           await axiosInstance.post(`/order/payment-failed`, { orderId });
      //           alert("Payment was not completed. Order marked as failed.");
      //         } catch (error) {
      //           console.error("Error updating payment status:", error);
      //         }
        
      //         navigate('/user-profile/orders'); // Redirect to orders page
      //       },
      //     },
          
      //   };

      //   const rzp = new window.Razorpay(options);
      //   rzp.open();
      if (response.data.razorpayOrderId) {
        openRazorpayModal({
          key: response.data.key,
          amount: response.data.amount,
          order_id: response.data.razorpayOrderId,
          orderId:response.data.orderId,
          navigate
        });
      }
      // }
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
    console.log("productid", orderId);
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
export const getOrderStats= createAsyncThunk(
  "/orders/stats",
  async (payload, { rejectWithValue, getState, dispatch }) => {
  ;
    try {
      const response = await axiosInstance.get(`/order/sales/stats`);
      console.log("resstats", response.data);
      return response.data;
    } catch (error) {
      console.log(error);

      return rejectWithValue(error?.response?.data);
    }
  }
);

export const updateOrder = createAsyncThunk(
  "/order/update",
  async ({id,status}, { rejectWithValue, getState, dispatch }) => {
   
    try {
      
      const response = await axiosInstance.put(`/order/update/${id}`,{status});
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
     //get order statistics------------------------------------------------------------------------------------------------
     builder.addCase(getOrderStats.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getOrderStats.fulfilled, (state, action) => {
      state.loading = false;
      state.stats = action.payload;
    
    });
    builder.addCase(getOrderStats.rejected, (state, action) => {
      state.loading = false;

      state.stats = null;
     
      state.error = action.payload;
    });
     //update order------------------------------------------------------------------------------------------------
     builder.addCase(updateOrder.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.order = action.payload;
    
    });
    builder.addCase(updateOrder.rejected, (state, action) => {
      state.loading = false;

      state.order = null;
     
      state.error = action.payload;
    });
  },
});
const orderReducer = orderSlice.reducer;
export default orderReducer;
