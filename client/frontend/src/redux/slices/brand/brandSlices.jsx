import baseURL from "../../../utils/baseURL";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axios from "axios";
import axiosInstance from "../../../utils/axiosConfig";
import { resetError,resetSuccess } from "../../resetError/resetError";
//initalsState
const initialState = {
  brands: [],
  brand: {},
  loading: false,
  error: null,
  isAdded: false,
  isUpdated: false,
  isDelete: false,
};

//create category---------------------------------------------------------------------------------------------------------
export const createBrand = createAsyncThunk(
  "/brand/create",
  async (name, { rejectWithValue, getState, dispatch }) => {
    try {
      // const { name } = payload;
     
     

      const response = await axiosInstance.post(
        `/brand`,
        {
          name,
        },
      
      );
      return response.data
    } catch (error) {
        console.log(error)
            
        return rejectWithValue(error?.response?.data)

    }
  }
);
//fetch category--------------------------------------------------------------------------------------------------------------------
export const fetchBrand = createAsyncThunk(
    "/brand/fetch",
    async (payload, { rejectWithValue, getState, dispatch }) => {
      try {
    
        // const token = getState()?.users?.userAuth?.userInfo?.token;
        // const config = {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //     "Content-Type": "multipart/form-data",
        //   },
        // };
  
        const response = await axiosInstance.get(
          `/brand`
        );
        return response.data
      } catch (error) {
        console.log(error)
            
        return rejectWithValue(error?.response?.data)
  
      }
    }
  )

const brandSlice = createSlice({name:'brands',
    initialState,
    extraReducers:(builder)=>{
        builder.addCase(createBrand.pending,(state,action)=>{
            state.loading=true;
        });
        builder.addCase(createBrand.fulfilled,(state,action)=>{
          console.log("Payload:", action.payload);
            state.loading=false;
            state.brand = action.payload;
            state.isAdded = true;
        });
        builder.addCase(createBrand.rejected,(state,action)=>{
        
            state.loading = false;
            state.brand= null;
            state.isAdded = false;
            state.error = action.payload;
        });
        builder.addCase(fetchBrand.pending,(state,action)=>{
            state.loading=true;
        });
        builder.addCase(fetchBrand.fulfilled,(state,action)=>{
            state.loading=false;
            state.brands = action.payload;
           
        });
        builder.addCase(fetchBrand.rejected,(state,action)=>{
            state.loading=false;
            state.brands= null;
            state.error = action.payload;
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
    }
})
const brandReducer = brandSlice.reducer;
export default brandReducer
