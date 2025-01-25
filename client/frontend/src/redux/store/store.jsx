import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/users/userSlices";
import productReducer from "../slices/products/productSlices";
import categoryReducer from "../slices/category/categorySlices";
import brandReducer from "../slices/brand/brandSlices";
import colorReducer from "../slices/color/colorSlices";
import cartReducer from "../slices/cart/cartSlices";
const store = configureStore({
    reducer:{
        users:userReducer,
        products:productReducer,
        categories:categoryReducer,
        brands:brandReducer,
        colors:colorReducer,
        carts:cartReducer
    }
});
export default store