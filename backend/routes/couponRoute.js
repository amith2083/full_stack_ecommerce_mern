import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";
import { createCoupon } from "../controllers/couponCtrl.js";

const couponRoute= express.Router()
couponRoute.post('/',isLoggedIn,isAdmin,createCoupon)

export default couponRoute