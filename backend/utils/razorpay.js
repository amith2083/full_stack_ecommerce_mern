import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

// Initialize Razorpay to create instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


export const createRazorpayOrder = async (orderId, totalPrice) => {
  return await razorpay.orders.create({
    amount: totalPrice * 100, // Convert to paisa
    currency: "INR",
    receipt: `order_rcptid_${orderId}`,
    payment_capture: 1,
  });
};


export const verifyRazorpayPayment = (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const generated_signature = hmac.digest("hex");

  return generated_signature === razorpay_signature;
};
