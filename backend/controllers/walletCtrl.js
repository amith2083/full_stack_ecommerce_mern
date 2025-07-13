import Wallet from "../model/Wallet.js";
import User from "../model/User.js";
import asyncHandler from "express-async-handler";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../utils/razorpay.js";

// Fetch wallet details
export const getWalletDetails = asyncHandler(async (req, res) => {
  const userId = req.userAuthId; 

  const wallet = await Wallet.findOne({ userId });

  if (!wallet) {
    res.status(404);
    throw new Error("Wallet not found");
  }

  res.status(200).json({
    success: true,
    wallet,
  });
});

export const addFunds = async (req, res) => {
  const { amount } = req.body;
  const userId = req.userAuthId; 

  console.log("amount", amount);

  const razorpayOrder = await createRazorpayOrder(userId.toString(), amount);
  console.log("walletrazorpayorder:", razorpayOrder);

  res.json({
    success: true,
    order_id: razorpayOrder.id,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
};

export const verifyWalletPayment = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, amount } =
    req.body;
  const userId = req.userAuthId;
  console.log("reqbody:", req.body);

  // Verify the Razorpay signature
  const isSignatureValid = verifyRazorpayPayment(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature

    //   process.env.RAZORPAY_KEY_SECRET
  );
  console.log("isSignatureValid:", isSignatureValid);
  if (!isSignatureValid) {
    res.status(400);
    throw new Error("Invalid payment ");
  }

  // Fetch or create the user's wallet
  let wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    wallet = new Wallet({ userId, amount: 0, walletHistory: [] });
  }

  // Add the transaction to the wallet history
  await wallet.addTransaction("credit", amount, "Funds added via Razorpay");

  // Return success response
  return res.json({
    success: true,
    message: "Payment verified and wallet updated",
  });
};
