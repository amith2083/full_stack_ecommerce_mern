import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../model/Order.js";
import Product from "../model/Product.js";
import User from "../model/User.js";
import Cart from "../model/Cart.js";
import Wallet from "../model/Wallet.js";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../utils/razorpay.js";

export const getOrderStats = asyncHandler(async (req, res) => {
  //get order stats
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        minimumSale: {
          $min: "$totalPrice",
        },
        totalSales: {
          $sum: "$totalPrice",
        },
        maxSale: {
          $max: "$totalPrice",
        },
        avgSale: {
          $avg: "$totalPrice",
        },
      },
    },
  ]);
  //get the date
  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const saleToday = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: today,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);
  //send response
  res.status(200).json({
    success: true,
    message: "Sum of orders",
    orders,
    saleToday,
  });
});

export const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, totalPrice, paymentMethod } = req.body;
  console.log(req.body);
  //Find the user
  const user = await User.findById(req.userAuthId);
  //Check if user has shipping address
  if (!user?.hasShippingAddress) {
    throw new Error("Please provide shipping address");
  }
  // Restrict COD for orders above ₹1000
  if (paymentMethod === "cod" && totalPrice > 1000) {
    return res.status(400).json({ success: false, message: "COD is not available for orders above ₹1000. Please choose another payment method." });
  }
// Handle Wallet Payment First (Stop if Insufficient Balance)
if (paymentMethod === "wallet") {
  const wallet = await Wallet.findOne({ userId: user._id });
  
  if (!wallet || wallet.amount < totalPrice) {
    return res.status(400).json({ success: false, message: "Insufficient wallet balance" });
  }

  // Deduct amount from wallet
  // wallet.amount -= totalPrice;
  await wallet.addTransaction("debit", totalPrice, "Order Payment");
  await wallet.save();
}

  //Place/create order - save into DB
  const order = await Order.create({
    user: user?._id,
    orderItems,
    shippingAddress,
    // totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice,
    totalPrice,
    paymentMethod,
    paymentStatus:paymentMethod==='wallet'?'Paid':'Not paid',
    status:paymentMethod === "wallet" || paymentMethod === "cod" ? "processing" : "pending",
  });
  // Extract product IDs from orderItems
  const productIds = orderItems[0].items.map((item) => item.product._id);
  console.log("productIDS", productIds);

  // Find products in the database
  const products = await Product.find({ _id: { $in: productIds } });
  console.log("products", products);

  if (!products.length) {
    console.log("No products found");
  }

  // Loop through orderItems to update totalSold
  for (const orderItem of orderItems[0].items) {
    const product = products.find(
      (prod) => prod._id.toString() === orderItem.product._id.toString()
    );
    console.log("product", product);

    if (product) {
      product.totalSold += orderItem.qty;
      await product.save();
    }
  }

  
  //push order into user
  user.orders.push(order?._id);
  await user.save();
  // delete cart after placing order
  await Cart.findOneAndDelete({ user: user?._id });

    // Handle Razorpay Order Creation
    if (paymentMethod === "razorpay") {
      const razorpayOrder = await createRazorpayOrder(order._id, totalPrice);
      console.log("Razorpay Order:", razorpayOrder);
  
      return res.json({
        success: true,
        orderId: order._id,
        razorpayOrderId: razorpayOrder.id,
        amount: totalPrice,
        key: process.env.RAZORPAY_KEY_ID,
      });
    }

 
    return res.json({
      success: true,
      orderId: order._id,
      message: "Order placed successfully",
    });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      orderId,
      failed
    } = req.body;
    if (failed) {
      await Order.findByIdAndUpdate(
        { _id: new mongoose.Types.ObjectId(orderId) },
        { paymentStatus: "Failed" },
        { new: true }
      );
      return res.json({ success: false, message: "Payment failed" });
    }

    // console.log("Order ID Type:", typeof orderId, "Value:", orderId);

    // console.log("razorpay_order_id:", razorpay_order_id);
    // console.log("razorpay_payment_id:", razorpay_payment_id);

    if (
      verifyRazorpayPayment(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      )
    ) {
      await Order.findByIdAndUpdate(
        { _id: new mongoose.Types.ObjectId(orderId) },
        { paymentStatus: "Paid", status: "processing" },
        { new: true }
      );
      return res.json({
        success: true,
        message: "Payment verified",
        redirectUrl: "/success",
      });
    } else {
      await Order.findByIdAndUpdate(
        { _id: new mongoose.Types.ObjectId(orderId) },
        { paymentStatus: "Failes" },
        { new: true }
      );
      return res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Error in verifyPayment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});
// export const updatePaymentFailure = asyncHandler(async (req, res) => {
//   const { orderId } = req.body;

//   // Find the order and update payment status
//   const order = await Order.findById({
//     _id: new mongoose.Types.ObjectId(orderId),
//   });
//   if (!order) {
//     return res.status(404).json({ message: "Order not found" });
//   }

//   order.paymentStatus = "Failed"; // Update status
//   await order.save();

//   res.json({ success: true, message: "Payment marked as failed." });
// });

// Retry Payment Handler
export const retryPayment = async (req, res) => {
  try {
    const { orderId, totalPrice } = req.body;

    const order = await Order.findById({
      _id: new mongoose.Types.ObjectId(orderId),
    });
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    if (order.paymentStatus === "Paid") {
      return res
        .status(400)
        .json({ success: false, message: "Order is already paid" });
    }

    // Create new Razorpay Order

    // const razorpayOrder = await razorpay.orders.create({
    //   amount: totalPrice * 100, // Razorpay accepts amount in paisa (INR)
    //   currency: "INR",
    //   receipt: `order_rcptid_${order._id}`,
    //   payment_capture: 1, // Auto-capture payment
    // });
    // console.log("razor", razorpayOrder);
    // Create new Razorpay Order
    const razorpayOrder = await createRazorpayOrder(order._id, totalPrice);
    console.log("Retry Razorpay Order:", razorpayOrder);

    res.json({
      success: true,
      // orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: totalPrice,
      key: process.env.RAZORPAY_KEY_ID,
      orderId: order._id,
      // navigate:navigate
    });
  } catch (error) {
    console.error("Retry Payment Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to retry payment" });
  }
};

export const getAllorders = asyncHandler(async (req, res) => {
  //find all orders
  const user = await User.findById(req.userAuthId)
  let orders
  if(user.isAdmin){
     orders = await Order.find().populate("user");

  }else{
     orders = await Order.find({user:new mongoose.Types.ObjectId(req.userAuthId)} )
   
  }
  
  res.json({
    success: true,
    message: "All orders",
    orders,
  });
});

export const getSingleOrder = asyncHandler(async (req, res) => {
  //get the id from params
  const id = req.params.id;
  const order = await Order.findById(id);
  //send response
  res.status(200).json({
    success: true,
    message: "Single order",
    order,
  });
});
export const updateOrder = asyncHandler(async (req, res) => {
  //get the id from params
  const id = req.params.id;
  //update
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      status: req.body.status,
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    success: true,
    message: "Order updated",
    updatedOrder,
  });
});