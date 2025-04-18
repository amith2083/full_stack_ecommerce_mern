import baseURL from "../../../utils/baseURL";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axios from "axios";
import axiosInstance from "../../../utils/axiosConfig";
import { resetError, resetSuccess } from "../../resetError/resetError";
//initalsState
const initialState = {
  offers: [],
  offer: null,
  loading: false,
  error: null,
  isAdded: false,
  isUpdated: false,
  isDelete: false,
};

//create offer---------------------------------------------------------------------------------------------------------
export const createOffer = createAsyncThunk(
  "/offer/create",
  async (
    {
      code,
      offerType,
      offerValue,
      startDate,
      endDate,
      description,
      applicableTo,
      applicableToProduct,
      applicableToCategory,
      usageLimit,
    },
    { rejectWithValue, getState, dispatch }
  ) => {
    
   
    try {
        console.log('+++++',code,
            offerType,
            offerValue,
            startDate,
            endDate,
            description,
            applicableTo,
            applicableToProduct,
            applicableToCategory,
            usageLimit,)
     

      const response = await axiosInstance.post(`/offer`, {
        code,
        offerType,
        offerValue,
        startDate,
        endDate,
        description,
        applicableTo,
        applicableToProduct,
        applicableToCategory,
        usageLimit,
      });
      return response.data;
    } catch (error) {
      console.log(error);

      return rejectWithValue(error?.response?.data);
    }
  }
);
//fetch offers--------------------------------------------------------------------------------------------------------------------
export const fetchOffers = createAsyncThunk(
  "/offers/fetch",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const response = await axiosInstance.get(`/offer`);
      return response.data;
    } catch (error) {
      console.log(error);

      return rejectWithValue(error?.response?.data);
    }
  }
);
//fetch single offer--------------------------------------------------------------------------------------------------------------------
export const fetchOffer = createAsyncThunk(
  "/offer/fetch",
  async (code, { rejectWithValue, getState, dispatch }) => {
    try {
      const response = await axiosInstance.get(`/offer/single?code=${encodeURIComponent(code)}`);
      return response.data;
    } catch (error) {
      console.log(error);

      return rejectWithValue(error?.response?.data);
    }
  }
);
export const updateOffer = createAsyncThunk(
  "/offer/update",
  async (
    {  updatedData, id },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
     
      const response = await axiosInstance.put(`/offer/${id}`, {
       ...updatedData
      });
      return response.data;
    } catch (error) {
      console.log(error);

      return rejectWithValue(error?.response?.data);
    }
  }
);

//unlist/list offer---------------------------------------------------------------------------------------------------------
export const unlistListOffer = createAsyncThunk("unlistList/", async (offerId, { rejectWithValue, getState, dispatch  }) => {
  try {
    
    const response = await axiosInstance.put(`/offer/list-unlist/${offerId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const offerSlice = createSlice({
  name: "offer",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(createOffer.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(createOffer.fulfilled, (state, action) => {
      console.log("Payload:", action.payload);
      state.loading = false;
      state.offer = action.payload;
      state.isAdded = true;
    });
    builder.addCase(createOffer.rejected, (state, action) => {
      state.loading = false;
      state.offer = null;
      state.isAdded = false;
      state.error = action.payload;
    });
    builder.addCase(fetchOffers.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchOffers.fulfilled, (state, action) => {
      state.loading = false;
      state.offers = action.payload;
    });
    builder.addCase(fetchOffers.rejected, (state, action) => {
      state.loading = false;
      state.offers = null;
      state.error = action.payload;
    });
    //for single offer-------------------------------------------------------------------------------------------------------
    builder.addCase(fetchOffer.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchOffer.fulfilled, (state, action) => {
      state.loading = false;
      state.offer = action.payload;
    });
    builder.addCase(fetchOffer.rejected, (state, action) => {
      state.loading = false;
      state.offer = null;
      state.error = action.payload;
    });

    //update offer
    builder.addCase(updateOffer.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateOffer.fulfilled, (state, action) => {
   
      state.loading = false;
      state.offer = action.payload;
      state.isUpdated = true;
    });
    builder.addCase(updateOffer.rejected, (state, action) => {
      state.loading = false;
      state.offer = null;
      state.isUpdated = false;
      state.error = action.payload;
    });
  //list-unlist offer----------------------------------------------------------------------------------------------------
     builder.addCase(unlistListOffer.pending, (state, action) => {
       state.loading = true;
     });
     builder.addCase(unlistListOffer.fulfilled, (state, action) => {
       state.offer = action.payload;
       state.loading = false;
     });
     builder.addCase(unlistListOffer.rejected, (state, action) => {
       state.error = action.payload;
       state.loading = false;
     });
  
    //reset error action
    builder.addCase(resetError.pending, (state, action) => {
      state.isAdded = false;
      state.error = null;
      state.isUpdated = false;
    });
    //reset success action
    builder.addCase(resetSuccess.pending, (state, action) => {
      state.isAdded = false;
      state.error = null;
      state.isUpdated = false;
    });
  },
});
const offerReducer = offerSlice.reducer;
export default offerReducer;
