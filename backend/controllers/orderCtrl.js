import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();
// import Stripe from "stripe";

console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID);
console.log('RAZORPAY_SECRET:', process.env.RAZORPAY_KEY_SECRET);

import Razorpay from "razorpay";
import crypto from "crypto";

import Order from "../model/Order.js";
import Product from "../model/Product.js";
import User from "../model/User.js";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


export const createOrder= asyncHandler(async (req, res) => {
   
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
const productIds = orderItems[0].items.map(item => item.product._id);
console.log('productIDS',productIds)

// Find products in the database
const products = await Product.find({ _id: { $in: productIds } });
console.log('products',products)

if (!products.length) {
  console.log("No products found");
}

// Loop through orderItems to update totalSold
for (const orderItem of orderItems[0].items) {
  const product = products.find(prod => prod._id.toString() === orderItem.product._id.toString());
  console.log('product',product)

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
  
    //make payment (stripe)
    //convert order items to have same structure that stripe need
    // const convertedOrders = orderItems.map((item) => {
    //   return {
    //     price_data: {
    //       currency: "usd",
    //       product_data: {
    //         name: item?.name,
    //         description: item?.description,
    //       },
    //       unit_amount: item?.price * 100,
    //     },
    //     quantity: item?.qty,
    //   };
    // });
    // const session = await stripe.checkout.sessions.create({
    //   line_items: convertedOrders,
    //   metadata: {
    //     orderId: JSON.stringify(order?._id),
    //   },
    //   mode: "payment",
    //   success_url: "http://localhost:3000/success",
    //   cancel_url: "http://localhost:3000/cancel",
    // });
    // res.send({ url: session.url });
     // Create a Razorpay Order
  const razorpayOrder = await razorpay.orders.create({
    amount: totalPrice * 100, // Razorpay accepts amount in paisa (INR)
    currency: "INR",
    receipt: `order_rcptid_${order._id}`,
    payment_capture: 1, // Auto-capture payment
  });
  console.log('razor',razorpayOrder)

  res.json({
    success: true,
    orderId: order._id,
    razorpayOrderId: razorpayOrder.id,
    amount: totalPrice,
    key: process.env.RAZORPAY_KEY_ID,
  });
  });

  export const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
  
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");
  
    if (generated_signature === razorpay_signature) {
      await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { paymentStatus: "Paid", isPaid: true }
      );
      return res.json({ success: true, message: "Payment verified" });
    } else {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  });
  
  
  


  export const getAllorders = asyncHandler(async (req, res) => {
    //find all orders
    const orders = await Order.find().populate("user");
    res.json({
      success: true,
      message: "All orders",
      orders,
    });
  });
  
  