import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";
import { createCoupon, deleteCoupon, getAllCoupons, updateCoupon,getCoupon } from "../controllers/couponCtrl.js";

const couponRoute= express.Router()
couponRoute.post('/',isLoggedIn,isAdmin,createCoupon)
couponRoute.get('/', getAllCoupons)
couponRoute.put('/:id',isLoggedIn,isAdmin,updateCoupon)
couponRoute.get('/single',getCoupon)
couponRoute.delete('/:id',isLoggedIn,isAdmin,deleteCoupon)

export default couponRoute