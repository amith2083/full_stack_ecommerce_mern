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