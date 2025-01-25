import baseURL from "../../../utils/baseURL";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axios from "axios";
import axiosInstance from "../../../utils/axiosConfig";
import { resetError,resetSuccess } from "../../resetError/resetError";
//initalsState
const initialState = {
 colors: [],
  color: {},
  loading: false,
  error: null,
  isAdded: false,
  isUpdated: false,
  isDelete: false,
};

//create category---------------------------------------------------------------------------------------------------------
export const createColor = createAsyncThunk(
  "/color/create",
  async (name, { rejectWithValue, getState, dispatch }) => {
    try {
      // const { name } = payload;
      // const token = getState()?.users?.userAuth?.userInfo?.token;
      // const config = {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     "Content-Type": "multipart/form-data",
      //   },
      // };

      const response = await axiosInstance.post(
        `/color`,
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
export const fetchColor = createAsyncThunk(
    "/color/fetch",
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
          `/color`
        );
        console.log('fetchcolor',response.data)
        return response.data
      } catch (error) {
        console.log(error)
            
        return rejectWithValue(error?.response?.data)
  
      }
    }
  )

const colorSlice = createSlice({name:'colors',
    initialState,
    extraReducers:(builder)=>{
        builder.addCase(createColor.pending,(state,action)=>{
            state.loading=true;
        });
        builder.addCase(createColor.fulfilled,(state,action)=>{
            state.loading=false;
            state.color = action.payload;
            state.isAdded = true;
        });
        builder.addCase(createColor.rejected,(state,action)=>{
        
            state.loading = false;
            state.color= null;
            state.isAdded = false;
            state.error = action.payload;
        });
        builder.addCase(fetchColor.pending,(state,action)=>{
            state.loading=true;
        });
        builder.addCase(fetchColor.fulfilled,(state,action)=>{
            state.loading=false;
            state.colors = action.payload;
           
        });
        builder.addCase(fetchColor.rejected,(state,action)=>{
            state.loading=false;
            state.colors= null;
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
const colorReducer = colorSlice.reducer;
export default colorReducer
