import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage for persistence
import userReducer from "../slices/users/userSlices";
import productReducer from "../slices/products/productSlices";
import categoryReducer from "../slices/category/categorySlices";
import brandReducer from "../slices/brand/brandSlices";
import colorReducer from "../slices/color/colorSlices";
import cartReducer from "../slices/cart/cartSlices";
import couponReducer from "../slices/coupon/couponSlices";
import orderReducer from "../slices/order/orderSlices";
import reviewReducer from "../slices/review/reviewSlices";
import wishListReducer from "../slices/wishlist/wishListSlices";
import walletReducer from "../slices/wallet/walletSlices";
const store = configureStore({
    reducer:{
        users:userReducer,
        products:productReducer,
        categories:categoryReducer,
        brands:brandReducer,
        colors:colorReducer,
        carts:cartReducer,
        coupons: couponReducer,
        orders:orderReducer,
        reviews:reviewReducer,
        wishLists:wishListReducer,
        wallet:walletReducer,
        }
});
export default store