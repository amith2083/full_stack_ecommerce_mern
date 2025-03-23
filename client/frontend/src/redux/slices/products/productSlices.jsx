import baseURL from "../../../utils/baseURL";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axios from "axios";
import axiosInstance from "../../../utils/axiosConfig";
import { resetError, resetSuccess } from "../../resetError/resetError";
//initalsState
const initialState = {
  products: [],
  product: null,
  loading: false,
  pagination:{},
  error: null,
  isAdded: false,
  isUpdated: false,
  isDelete: false,
};
export const createProduct = createAsyncThunk(
  "/product/create",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    console.log("payload", payload);
    try {
      const {
        name,
        description,
        category,
        sizes,
        brand,
        color,
        price,
        totalQty,
        files,
      } = payload;
      

      // const token = getState()?.users?.userAuth?.userInfo?.token;
      // console.log("Token from Redux state:", token); // Debugging log
      // const config = {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     "Content-Type": "multipart/form-data",
      //   },
      // };
      //FormData
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);

      formData.append("brand", brand);
      formData.append("price", price);
      formData.append("totalQty", totalQty);

      sizes.forEach((size) => {
        formData.append("sizes", size);
      });
      color.forEach((color) => {
        formData.append("color", color);
      });

      files.forEach((file) => {
        formData.append("files", file);
      });
      // Debugging FormData contents
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await axiosInstance.post(`/product`, formData);
      console.log("res", response.data);
      return response.data;
    } catch (error) {
      console.log(error);

      return rejectWithValue(error?.response?.data);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "/product/update",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    console.log("payload", payload);
    try {
      const {
        name,
        description,
        category,
        sizes,
        brand,
        color,
        price,
        totalQty,
        files,
        removedImages,
        id
      } = payload;
      

     
      //FormData
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);

      formData.append("brand", brand);
      formData.append("price", price);
      formData.append("totalQty", totalQty);

      sizes.forEach((size) => {
        formData.append("sizes", size);
      });
      color.forEach((color) => {
        formData.append("color", color);
      });

    // Append images
    if (files.length > 0) {
      files.forEach((file) => formData.append("files", file));
    }

    // Append removed images (send as an array of filenames/URLs)
    if (removedImages.length > 0) {
      removedImages.forEach((img) => formData.append("removedImages[]", img));
    }
      // Debugging FormData contents
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await axiosInstance.put(`/product/${id}`, formData);
     
      return response.data;
    } catch (error) {
      console.log(error);

      return rejectWithValue(error?.response?.data);
    }
  }
);

//fetching products---------------------------------------------------------------------------------------------------------
export const fetchProduct = createAsyncThunk(
  "/products/fetch",
  async ({url}, { rejectWithValue, getState, dispatch }) => {
  
    try {
      const response = await axiosInstance.get(`${url}`);
      
      return response.data;
    } catch (error) {
      console.log(error);

      return rejectWithValue(error?.response?.data);
    }
  }
);

//fetch singleProduct for product details page--------------------------------------------------------------------------------------
export const fetchSingleProduct = createAsyncThunk(
  "/product/fetch",
  async (productId, { rejectWithValue, getState, dispatch }) => {
    console.log("productid", productId);
    try {
      const response = await axiosInstance.get(`/product/${productId}`);
  
      return response.data;
    } catch (error) {
      console.log(error);

      return rejectWithValue(error?.response?.data);
    }
  }
);
//unlist/list product---------------------------------------------------------------------------------------------------------
export const unlistListProduct = createAsyncThunk("unlistList/", async (productId, { rejectWithValue, getState, dispatch  }) => {
  try {
    
    const response = await axiosInstance.put(`/product/list-unlist/${productId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});


const productSlice = createSlice({
  name: "products",
  initialState,
  extraReducers: (builder) => {
    //creation of products---------------------------------------------------------------------------------------------
    builder.addCase(createProduct.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(createProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.product = action.payload;
      state.isAdded = true;
    });
    builder.addCase(createProduct.rejected, (state, action) => {
      state.loading = false;

      state.product = null;
      state.isAdded = false;
      state.error = action.payload;
    });
//updation of product-----------------------------------------------------------------------------------------------------------------
    builder.addCase(updateProduct.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.product = action.payload;
      state.isUpdated = true;
    });
    builder.addCase(updateProduct.rejected, (state, action) => {
      state.loading = false;

      state.product = null;
      state.isUpdated = false;
      state.error = action.payload;
    });


    //after sucess of product creation-------------------------------------------------------------------------------
    builder.addCase(resetSuccess.pending, (state, action) => {
      state.isAdded = false;
      state.isUpdated=false
    });

    builder.addCase(resetError.pending, (state, action) => {
      state.error = null;
    });
    //fetching products------------------------------------------------------------------------------------------------
    builder.addCase(fetchProduct.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload.products;
      state.pagination = action.payload.pagination;
      
      // state.isAdded = true;
    });
    builder.addCase(fetchProduct.rejected, (state, action) => {
      state.loading = false;

      state.products = null;
      state.isAdded = false;
      state.error = action.payload;
    });
    //fetching single product-----------------------------------------------------------------------------------------
    builder.addCase(fetchSingleProduct.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchSingleProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.product = action.payload.product;
      state.isAdded = true;
     
    });
    builder.addCase(fetchSingleProduct.rejected, (state, action) => {
      state.loading = false;

      state.product = null;
      state.isAdded = false;
      state.error = action.payload;
    });
    //list-unlist products----------------------------------------------------------------------------------------------------
    builder.addCase(unlistListProduct.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(unlistListProduct.fulfilled, (state, action) => {
      state.product = action.payload;
      state.loading = false;
    });
    builder.addCase(unlistListProduct.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
  },
});
const productReducer = productSlice.reducer;
export default productReducer;
