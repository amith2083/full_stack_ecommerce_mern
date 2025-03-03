import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();
// import Stripe from "stripe";

// console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID);
// console.log('RAZORPAY_SECRET:', process.env.RAZORPAY_KEY_SECRET);
import mongoose from "mongoose";
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../model/Order.js";
import Product from "../model/Product.js";
import User from "../model/User.js";
import Cart from "../model/Cart.js";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../utils/razorpay.js";

// Initialize Razorpay
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

export const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, totalPrice } = req.body;
  console.log(req.body);
  //Find the user
  const user = await User.findById(req.userAuthId);
  //Check if user has shipping address
  if (!user?.hasShippingAddress) {
    throw new Error("Please provide shipping address");
  }
  //Place/create order - save into DB
  const order = await Order.create({
    user: user?._id,
    orderItems,
    shippingAddress,
    // totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice,
    totalPrice,
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

  //Update the product qty
  // const products = await Product.find({ _id: { $in: orderItems } });
  //   //Check if order is not emptydr

  //   orderItems?.map(async (order) => {
  //     const product = products?.find((product) => {
  //       return product?._id?.toString() === order?._id?.toString();
  //     });
  //     console.log('++',product)
  //     if (product) {
  //       product.totalSold += order.qty;
  //     }
  //     await product.save();
  //   });
  //push order into user
  user.orders.push(order?._id);
  await user.save();
  // delete cart after placing order
  await Cart.findOneAndDelete({ user: user?._id });

  // Create a Razorpay Order
  // const razorpayOrder = await razorpay.orders.create({
  //   amount: totalPrice * 100, // Razorpay accepts amount in paisa (INR)
  //   currency: "INR",
  //   receipt: `order_rcptid_${order._id}`,
  //   payment_capture: 1, // Auto-capture payment
  // });
  // console.log("razor", razorpayOrder);
  // Create Razorpay Order
  const razorpayOrder = await createRazorpayOrder(order._id, totalPrice);
  console.log("Razorpay Order:", razorpayOrder);

  res.json({
    success: true,
    orderId: order._id,
    razorpayOrderId: razorpayOrder.id,
    amount: totalPrice,
    key: process.env.RAZORPAY_KEY_ID,
    // navigate:navigate
  });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      orderId,
    } = req.body;

    console.log("Order ID Type:", typeof orderId, "Value:", orderId);

    console.log("razorpay_order_id:", razorpay_order_id);
    console.log("razorpay_payment_id:", razorpay_payment_id);

    if (
      verifyRazorpayPayment(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      )
    ) {
      await Order.findByIdAndUpdate(
        { _id: new mongoose.Types.ObjectId(orderId) },
        { paymentStatus: "Paid" },
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
        { paymentStatus: "Failed" },
        { new: true }
      );
      return res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Error in verifyPayment:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
  }
});
export const updatePaymentFailure = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  // Find the order and update payment status
  const order = await Order.findById({
    _id: new mongoose.Types.ObjectId(orderId),
  });
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.paymentStatus = "Failed"; // Update status
  await order.save();

  res.json({ success: true, message: "Payment marked as failed." });
});

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
  const orders = await Order.find().populate("user");
  res.json({
    success: true,
    message: "All orders",
    orders,
  });
});
