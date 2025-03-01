import express from "express";
import { createWishlist,getWishlist, removeFromWishlist } from "../controllers/wishlistCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";


const wishListRoute = express.Router()



wishListRoute.get('/', isLoggedIn,getWishlist)
wishListRoute.post('/add/:id', isLoggedIn, createWishlist);
wishListRoute.delete('/remove/:id', isLoggedIn, removeFromWishlist);



export default wishListRoute;