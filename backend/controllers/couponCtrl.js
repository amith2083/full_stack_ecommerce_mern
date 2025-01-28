import asyncHandler from "express-async-handler";
import Coupon from "../model/Coupon.js";
import moment  from "moment";

export const createCoupon = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;
  console.log(req.body);
   // Parse dates
   const parsedStartDate = moment(startDate, "DD-MM-YYYY").toDate();
   const parsedEndDate = moment(endDate, "DD-MM-YYYY").toDate();
  
  //check if coupon already exists
  const couponsExists = await Coupon.findOne({
    code,
  });
  if (couponsExists) {
    throw new Error("Coupon already exists");
  }
  //check if discount is a number
  if (isNaN(discount)) {
    throw new Error("Discount value must be a number");
  }
  //create coupon
  const coupon = await Coupon.create({
    code: code,
    startDate:parsedStartDate,
    endDate:parsedEndDate,
    discount,
    user: req.userAuthId,
  });
  //send the response
  res.status(201).json({
    status: "success",
    message: "Coupon created successfully",
    coupon,
  });
});


export const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find();
  res.status(200).json({
    status: "success",
    message: "All coupons",
    coupons,
  });
});


export const getCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findOne({ code: req.query.code });
  //check if is not found
  if (coupon === null) {
    throw new Error("Coupon not found");
  }
  //check if expired
  if (coupon.isExpired) {
    throw new Error("Coupon Expired");
  }
  res.json({
    status: "success",
    message: "Coupon fetched",
    coupon,
  });
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;
  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    {
      code: code?.toUpperCase(),
      discount,
      startDate,
      endDate,
    },
    {
      new: true,
    }
  );
  res.json({
    status: "success",
    message: "Coupon updated successfully",
    coupon,
  });
});

export const deleteCoupon= asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "Coupon deleted successfully",
    coupon,
  });
});