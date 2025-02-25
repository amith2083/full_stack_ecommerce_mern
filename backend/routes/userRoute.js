import express from "express";
import passport from "../config/passport.js";
import { login, register,getUserProfile, verifyOtp, resendOtp, googleLogin } from "../controllers/userCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { updateShippingAddress } from "../controllers/userCtrl.js";

const userRoutes = express.Router();


userRoutes.post('/register',register)
userRoutes.post('/verify-otp',verifyOtp)
userRoutes.post('/resend-otp',resendOtp)
userRoutes.post('/login',login)

userRoutes.get('/profile',isLoggedIn,getUserProfile)
userRoutes.put('/update/address',isLoggedIn,updateShippingAddress)
// Route to initiate Google authentication
// userRoutes.get(
//     "/google",
//     passport.authenticate("google", { scope: ["profile", "email"] })
//   );
  
//   // Callback route after Google authentication
//   userRoutes.get(
//     "/google/callback",
//     passport.authenticate("google", { failureRedirect: "/register" ,session: false,}),
//     (req, res) => {
//       res.redirect("/home"); // Redirect to a protected page after login
//     }
//   );
userRoutes.get("/google/callback", googleLogin);

export default userRoutes;