import express from "express";
import { addToCart,getCart,removeFromCart,updateCartItem } from "../controllers/cartCtrl.js";
import isAdmin from "../middlewares/isAdmin.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const cartRoute = express.Router();

cartRoute.get("/",isLoggedIn, getCart);
cartRoute.post("/:id",isLoggedIn,addToCart);
cartRoute.put("/:productId", isLoggedIn,updateCartItem);
cartRoute.delete("/:productId",isLoggedIn, removeFromCart)

export default cartRoute;