import User from "../model/User.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";
import sendEmail from "../utils/sendEmail.js";
import OTP from "../model/Otp.js";
import crypto from "crypto";
import oauth2client from "../utils/googleConfig.js";
import axios from "axios";
import mongoose from "mongoose";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("User already exists,please register with new email");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Generate OTP
  const otp = crypto.randomInt(100000, 999999).toString();

  // Store OTP temporarily in OTP collection
  await OTP.create({ email, otp, name, password: hashedPassword });

  // Send OTP to user email
  await sendEmail(email, `Your OTP is ${otp}`);

  res.status(201).json({
    status: "success",
    message: "OTP sent to email",
    email,
  });
});
export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  // Check if OTP exists
  const storedOtp = await OTP.findOne({ email, otp });
  if (!storedOtp) {
    res.status(400);
    throw new Error("Invalid OTP");
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email: storedOtp.email });
  if (existingUser) {
    res.status(400);
    throw new Error("User already registered");
  }

  // Delete OTP after successful verification
  await OTP.deleteOne({ email });

  // Create permanent user
  const user = await User.create({
    name: storedOtp.name,
    email: storedOtp.email,
    password: storedOtp.password,
  });

  return res.status(200).json({
    status: "success",
    message: "User registered successfully, you can log in now",
  });
});

// Resend OTP
export const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Check if user exists
  const user = await OTP.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error(" Please register again to get a new OTP.");
  }

  // Generate new OTP
  const newOtp = crypto.randomInt(100000, 999999).toString();

  // Update OTP in DB
  user.otp = newOtp;
  user.createdAt = new Date();
  await user.save();

  // Send OTP via email
  await sendEmail(email, newOtp);

  res.status(200).json({ message: "New OTP sent to your email" });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const userFound = await User.findOne({ email });
  // Check if the email exists
  if (!userFound) {
    res.status(404);
    throw new Error("Email not found. Please sign up.");
  }
  // Validate password
  const isMatch = await bcrypt.compare(password, userFound.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password.");
  }
  // Check if the user is blocked
  if (userFound.isBlocked) {
    res.status(403);
    throw new Error("Your account is blocked. Contact support.");
  }

  res.status(200).json({
    message: "login success",
    user: {
      isAdmin: userFound.isAdmin,
      name: userFound.name,
    },
    token: generateToken(userFound?._id),
  });
});
export const googleLogin = asyncHandler(async (req, res) => {
  const { code } = req.query;

  const googleRes = await oauth2client.getToken({
    code,
  });//to get access token by exchange authorization code

  oauth2client.setCredentials(googleRes.tokens);
  const userRes = await axios.get(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
  );// Uses the access token to get the user’s email, name, and picture from Google’s Api

  const { email, name, picture } = userRes.data;
  // Check if user exists, else create new user
  let user = await User.findOne({ email });

  if (user) {
    // User exists - check if they're allowed to log in via Google
    if (user.isBlocked) {
      return res
        .status(403)
        .json({ message: "Your account is blocked. Contact support." });
    }

    // Handle case where user signed up with email/password but now tries to log in with Google
    if (!user.isGoogleAuth) {
      user.isGoogleAuth = true;
      await user.save();
    }
  } else {
    // First-time Google login - create new user
    user = await User.create({ email, name, isGoogleAuth: true });
  }

  const token = await generateToken(user?._id);
  return res.status(200).json({
    message: "success",
    user,
    token,
  });

  res.status(500).json({ message: "Authentication failed" });
});
export const updateShippingAddress = asyncHandler(async (req, res) => {
  const { firstName, lastName, address, city, postalCode, phone, country } =
    req.body;
  const user = await User.findById(req.userAuthId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  // Check if address already exists (based on all fields)
  const isDuplicate = user.shippingAddress.some(
    (addr) =>
      addr.firstName === firstName &&
      addr.lastName === lastName &&
      addr.address === address &&
      addr.city === city &&
      addr.postalCode === postalCode &&
      addr.phone === phone &&
      addr.country === country
  );
  if (isDuplicate) {
    res.status(400);
    throw new Error("This shipping address already exists");
  }
  const updatedUser = await User.findByIdAndUpdate(
    req.userAuthId,
    {
      $push: {
        shippingAddress: {
          firstName,
          lastName,
          address,
          city,
          postalCode,
          phone,
          country,
        },
      },
      hasShippingAddress: true,
    },
    {
      new: true,
    }
  );

  res.json({
    status: "success",
    message: "User shipping address updated successfully",
    user: updatedUser,
  });
});

export const updateUserShippingAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const { ...updatedAddress } = req.body;

  // Find user and update the specific shipping address
  const user = await User.findOneAndUpdate(
    { _id: req.userAuthId, "shippingAddress._id": addressId },
    {
      $set: {
        "shippingAddress.$.firstName": updatedAddress.firstName,
        "shippingAddress.$.lastName": updatedAddress.lastName,
        "shippingAddress.$.address": updatedAddress.address,
        "shippingAddress.$.city": updatedAddress.city,
        "shippingAddress.$.postalCode": updatedAddress.postalCode,
        "shippingAddress.$.phone": updatedAddress.phone,
        // "shippingAddress.$.country": updatedAddress.country,
      },
    },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ message: "User or address not found" });
  }

  res.status(200).json({ message: "Shipping address updated", user });

  // res.status(500).json({ message: "Server error", error: error.message });
});
export const deleteUserShippingAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;

  // Find the user and update the shipping address array
  const user = await User.findByIdAndUpdate(
    req.userAuthId,
    { $pull: { shippingAddress: { _id: addressId } } },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ message: "User or address not found" });
  }

  res.status(200).json({ message: "Shipping address deleted", user });

  // res.status(500).json({ message: "Server error", error: error.message });
});

export const getUserProfile = asyncHandler(async (req, res) => {
  //find the user
  const user = await User.findById(req.userAuthId);

  res.json({
    status: "success",
    message: "User profile fetched successfully",
    user,
  });
});
export const getAllUsers = asyncHandler(async (req, res) => {
  //find the user
  const users = await User.find().sort({ createdAt: -1 });;

  res.json({
    status: "success",
    message: "Users fetched successfully",
    users,
  });
});

export const blockUnblockUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  // if (!mongoose.Types.ObjectId.isValid(userId)) {

  // }

  // Find the user
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Toggle the isBlocked status
  user.isBlocked = !user.isBlocked;
  await user.save();

  res.status(200).json({
    message: `User ${user.isBlocked ? "Blocked" : "Unblocked"} successfully`,
    user,
  });
});
