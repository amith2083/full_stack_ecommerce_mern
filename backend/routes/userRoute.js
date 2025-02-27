import express from "express";

import {
  login,
  register,
  getUserProfile,
  verifyOtp,
  resendOtp,
  googleLogin,
  updateShippingAddress,
  updateUserShippingAddress,
  deleteUserShippingAddress,
} from "../controllers/userCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const userRoutes = express.Router();

userRoutes.post("/register", register);
userRoutes.post("/verify-otp", verifyOtp);
userRoutes.post("/resend-otp", resendOtp);
userRoutes.post("/login", login);
userRoutes.get("/google/callback", googleLogin);
userRoutes.put("/update/address", isLoggedIn, updateShippingAddress);

userRoutes.get("/profile", isLoggedIn, getUserProfile);
userRoutes.put(
  "/profile/shippingaddress/:addressId",
  isLoggedIn,
  updateUserShippingAddress
);
userRoutes.delete(
    "/profile/shippingaddress/:addressId",
    isLoggedIn,
   deleteUserShippingAddress
  );

export default userRoutes;
