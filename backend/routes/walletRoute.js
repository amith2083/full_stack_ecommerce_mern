
import express from "express";

import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { addFunds, getWalletDetails, verifyWalletPayment } from "../controllers/walletCtrl.js";

const walletRoute = express.Router()





walletRoute.get("/", isLoggedIn, getWalletDetails);
walletRoute.post("/user-profile/add-funds", isLoggedIn, addFunds);
walletRoute.post("/user-profile/payment-verify", isLoggedIn, verifyWalletPayment);

export default walletRoute;