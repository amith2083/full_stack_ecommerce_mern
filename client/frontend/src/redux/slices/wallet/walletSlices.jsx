import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosConfig";
import { openRazorpayModal } from "../../../utils/openRazorpayModal";



// Initial state
const initialState = {
  wallet: null,
  loading: false,
  error: null,
  isAdded: false,
};

// Async Thunk to Fetch Wallet Details
export const fetchWallet = createAsyncThunk(
  "wallet/fetchWallet",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/wallet");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async Thunk to Add Money to Wallet
export const addMoneyToWallet = createAsyncThunk(
  "wallet/addMoney",
  async ({ amount, navigate }, { rejectWithValue }) => {
    try {
      // Step 1: Create a Razorpay order
      const response = await axiosInstance.post("/wallet/user-profile/add-funds", { amount });
      if(response.data.order_id){
          // Step 2: Open Razorpay modal for payment
      const paymentResponse = await openRazorpayModal({order_id:response.data.order_id, amount, key:response.data.keyId,isWallet:true,navigate});

      }

    

    //   // Step 3: Verify payment
    //   if (paymentResponse) {
    //     const verifyResponse = await axiosInstance.post("/wallet/user-profile/verify-payment", {
    //       order_id: response.data,
    //       paymentId: paymentResponse.razorpay_payment_id,
    //       signature: paymentResponse.razorpay_signature,
    //       amount,
    //     });

    //     if (verifyResponse.data.success) {
    //       navigate("/user-profile/wallet");
    //       return verifyResponse.data;
    //     } else {
    //       throw new Error("Payment verification failed");
    //     }
    //   } else {
    //     throw new Error("Payment cancelled");
    //   }
    return response.data
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// **Wallet Slice**
const walletSlice = createSlice({
  name: "wallet",
  initialState,
  
  extraReducers: (builder) => {
    builder
      .addCase(fetchWallet.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.wallet = action.payload.wallet;
      })
      .addCase(fetchWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addMoneyToWallet.pending, (state) => {
        state.loading = true;
      })
      .addCase(addMoneyToWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.isAdded = true;
        state.wallet = action.payload; // Update wallet state
      })
      .addCase(addMoneyToWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const walletReducer = walletSlice.reducer;
export default walletReducer;;
