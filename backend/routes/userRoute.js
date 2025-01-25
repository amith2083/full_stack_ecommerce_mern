import express from "express";
import { login, register,profilePage } from "../controllers/userCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { updateShippingAddress } from "../controllers/ProductCtrl.js";

const userRoutes = express.Router();


userRoutes.post('/register',register)
userRoutes.post('/login',login)
userRoutes.get('/profile',isLoggedIn,profilePage)
userRoutes.put('/update/address',isLoggedIn,updateShippingAddress)

export default userRoutes;