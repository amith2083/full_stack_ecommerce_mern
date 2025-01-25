import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie'
import axios from 'axios';
// import baseURL from '../../../utils/baseURL';
import axiosInstance from '../../../utils/axiosConfig';
import { resetError } from '../../resetError/resetError';
const initialState ={
    loading:false,
    error:null,
    users:[],
    user:null,
    profile:{},
    userAuth:{
        loading:false,
        error:null,
        userInfo:{}
    }

}
export const registerUserAction = createAsyncThunk(
    'user/register',async({email,password,name},{rejectWithValue,getState,dispatch})=>{
        try {
            console.log("Login Payload:", { email, password ,name});
            const response = await axiosInstance.post(`/user/register`,{
                email,
                password,
                name
            });
            console.log(response.data);
            // Store user info in cookies
            // Cookies.set('user', JSON.stringify(response.data));
            return response.data
        } catch (error) {
            console.log(error)
            
            return rejectWithValue(error?.response?.data)
        }

    }
)

export const loginUserAction = createAsyncThunk(
    'user/login',async({email,password},{rejectWithValue,getState,dispatch})=>{
        try {
            console.log("Login Payload:", { email, password });
            const token = getState()?.users?.userAuth?.userInfo?.token;
            console.log('token',token)
    //         const token = getState()?.users?.userAuth?.userInfo?.token;
    //   console.log("Token from Redux state:", token); // Debugging log
    //   const config = {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       "Content-Type": "multipart/form-data",
    //     },
    //   };
            const response = await axiosInstance.post(`/user/login`,{
                email,
                password
            });
            console.log(response.data);
            // Store user info in cookies
           
            Cookies.set('user', JSON.stringify(response.data), { expires: 7 });
                // Store the token in cookies
    //   Cookies.set('token', response.data.token, { expires: 7 }); // Expires in 7 days
            return response.data
        } catch (error) {
            console.log(error)
            
            return rejectWithValue(error?.response?.data)
        }

    }
)
//usersSlice
const userSlice = createSlice({
    name:'users',
    initialState,
    extraReducers:(builder)=>{
        builder.addCase(loginUserAction.pending,(state,action)=>{
            state.userAuth.loading =true
        });
        builder.addCase(loginUserAction.fulfilled,(state,action)=>{
            state.userAuth.userInfo =action.payload;
            state.userAuth.loading =false
        });
        builder.addCase(loginUserAction.rejected,(state,action)=>{
            state.userAuth.error =action.payload;
            state.userAuth.loading =false
        });
        builder.addCase(registerUserAction.pending,(state,action)=>{
            state.loading =true
        });
        builder.addCase(registerUserAction.fulfilled,(state,action)=>{
            state.user =action.payload;
            state.loading =false
        });
        builder.addCase(registerUserAction.rejected,(state,action)=>{
            state.error =action.payload;
            state.loading =false
        });
          //reset error action
    builder.addCase(resetError.pending, (state) => {
        state.error = null;
        state.userAuth.error=null;
      });
    }
})

const userReducer = userSlice.reducer;
export default userReducer