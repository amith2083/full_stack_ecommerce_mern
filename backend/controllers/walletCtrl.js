import Wallet from "../model/Wallet.js";
import User from "../model/User.js"; 
import asyncHandler from "express-async-handler";
import { createRazorpayOrder, verifyRazorpayPayment } from "../utils/razorpay.js";


// Fetch wallet details
export const getWalletDetails = asyncHandler(async (req, res) => {
    const userId = req.userAuthId; // Assuming user is authenticated and stored in req.userAuthId
  
    try {
      const wallet = await Wallet.findOne({ userId });
  
      if (!wallet) {
        return res.status(404).json({ success: false, message: "Wallet not found" });
      }
  
      res.status(200).json({
        success: true,
        wallet,
      });
    } catch (error) {
      console.error("Error fetching wallet:", error);
      res.status(500).json({ success: false, message: "Error fetching wallet details" });
    }
  });

export const addFunds = async (req, res) => {
  const { amount } = req.body;
  const userId = req.userAuthId; // Assuming you have user data in req.user
 
  console.log('amount',amount);

  try {
    const razorpayOrder = await createRazorpayOrder(userId.toString(), amount);
    console.log("walletrazorpayorder:", razorpayOrder);

    res.json({
      success: true,
      order_id: razorpayOrder.id,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res
      .status(500)
      .json({ success: false, message: "Error creating Razorpay order" });
  }
};

export const verifyWalletPayment = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, amount } = req.body;
  const userId = req.userAuthId;
  console.log("reqbody:", req.body);
  

  try {
    // Verify the Razorpay signature
    const isSignatureValid = verifyRazorpayPayment(
        razorpay_order_id, razorpay_payment_id, razorpay_signature
     
    //   process.env.RAZORPAY_KEY_SECRET
    );
    console.log("isSignatureValid:", isSignatureValid);

    if (!isSignatureValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature" });
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
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error verifying payment" });
  }
};
