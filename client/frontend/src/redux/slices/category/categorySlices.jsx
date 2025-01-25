import baseURL from "../../../utils/baseURL";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axios from "axios";
import axiosInstance from "../../../utils/axiosConfig";
import { resetError,resetSuccess } from "../../resetError/resetError";
//initalsState
const initialState = {
  categories: [],
  category: {},
  loading: false,
  error: null,
  isAdded: false,
  isUpdated: false,
  isDelete: false,
};

//create category---------------------------------------------------------------------------------------------------------
export const createCategory = createAsyncThunk(
  "/category/create",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const { name,file } = payload;
      // const token = getState()?.users?.userAuth?.userInfo?.token;
      // const config = {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     "Content-Type": "multipart/form-data",
      //   },
      // };
      const formData = new FormData();
      formData.append('name',name);
      formData.append('file',file)


      const response = axiosInstance.post(
        `/category`,
       formData
        
      );
      return response.data
    } catch (error) {
        console.log(error)
            
        return rejectWithValue(error?.response?.data)

    }
  }
);
//fetch category--------------------------------------------------------------------------------------------------------------------
export const fetchCategory = createAsyncThunk(
    "/category/fetch",
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
          `/category`
        );
        return response.data
      } catch (error) {
        console.log(error)
            
        return rejectWithValue(error?.response?.data)
  
      }
    }
  )

const categorySlice = createSlice({name:'categories',
    initialState,
    extraReducers:(builder)=>{
      //create category------------------------------------------------------------------------------------------------
        builder.addCase(createCategory.pending,(state,action)=>{
            state.loading=true;
        });
        builder.addCase(createCategory.fulfilled,(state,action)=>{
            state.loading=false;
            state.category = action.payload;
            state.isAdded = true;
        });
        builder.addCase(createCategory.rejected,(state,action)=>{
        
            state.loading = false;
            state.category= null;
            state.isAdded = false;
            state.error = action.payload;
        });
        //fetch categories------------------------------------------------------------------------------------------
        builder.addCase(fetchCategory.pending,(state,action)=>{
            state.loading=true;
        });
        builder.addCase(fetchCategory.fulfilled,(state,action)=>{
            state.loading=false;
            state.categories = action.payload;
           
        });
        builder.addCase(fetchCategory.rejected,(state,action)=>{
            state.loading=false;
            state.categories= null;
            state.error = action.payload;
        });
         //after sucess of product creation-------------------------------------------------------------------------------
    builder.addCase(resetSuccess.pending, (state, action) => {
      state.isAdded = false;
    });

    builder.addCase(resetError.pending, (state, action) => {
      state.error = null;
    });


    }
})
const categoryReducer = categorySlice.reducer;
export default categoryReducer
