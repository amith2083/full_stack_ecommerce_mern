import express from "express";
import { login, register,getUserProfile } from "../controllers/userCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { updateShippingAddress } from "../controllers/userCtrl.js";

const userRoutes = express.Router();


userRoutes.post('/register',register)
userRoutes.post('/login',login)
userRoutes.get('/profile',isLoggedIn,getUserProfile)
userRoutes.put('/update/address',isLoggedIn,updateShippingAddress)

export default userRoutes;