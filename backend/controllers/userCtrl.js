import User from "../model/User.js"; 
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcrypt'
import generateToken from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";
import sendEmail from "../utils/sendEmail.js";
import OTP from "../model/Otp.js";
import crypto from 'crypto'
import oauth2client from "../utils/googleConfig.js";
import axios from 'axios'
import mongoose from "mongoose";

// export const register = asyncHandler(async (req, res) => {
//     const { name, email, password } = req.body;
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//     throw new Error ("user already exists");
//     }
//     const salt = await bcrypt.genSalt(10)
//     const hashedPassword = await  bcrypt.hash(password,salt)
  
//     const user = await User.create({
//       name,
//       email,
//       password:hashedPassword,
//     });
//     res
//       .status(201)
//       .json({
//         status: "success",
//         msg: "user registered successfully",
//         data: user,
      
//       });
//   })

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  console.log('reg',req.body)
  
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Generate OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  
  // Store OTP temporarily in OTP collection
  await OTP.create({ email, otp,name,password:hashedPassword });

  // Send OTP to user email
  await sendEmail(email, "Your OTP Code", `Your OTP is ${otp}`);

  res.status(201).json({
    status: "success",
    msg: "OTP sent to email",
    email,
  });
});
export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  console.log('verify',email,otp)

  const storedOtp = await OTP.findOne({ email, otp });
  console.log('storedotp',storedOtp)
  if (!storedOtp) {
    return res.status(400).json({ msg: "Invalid OTP" });
  }

  // Delete OTP from DB after verification
  await OTP.deleteOne({ email });

  // Retrieve stored user data and create a permanent user
  // const userData = await OTP.findOne({  email: storedOtp?.email, });
  // console.log('userdata',userData)
  
  // const user = await User.create(userData);
  // Create a permanent user
  const user = await User.create({
    name:storedOtp.name,
    email: storedOtp.email,
    password:storedOtp.password // Add any other required fields
  });
  console.log('user3',user)

  res.status(200).json({ msg: "User registered successfully, you can log in now" });
});

// Resend OTP 
export const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  console .log('resend',email)

  // Check if user exists
  const user = await OTP.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  console.log('user',user)

  // Generate new OTP
  const newOtp = generateOtp(); // Function to generate a 6-digit OTP
  console.log('newotp',newOtp)

  // Update OTP in DB
  user.otp = newOtp;
  user.createdAt = new Date();
  await user.save();

  // Send OTP via email
  await sendOtpEmail(email, newOtp);

  res.status(200).json({ message: "New OTP sent to your email" });
});



export const login = asyncHandler(async(req,res)=>{
    const{email,password}= req.body
    const userFound = await User.findOne({email});
     // Check if the email exists
  if (!userFound) {
    return res.status(404).json({ message: "Email not found. Please sign up." });
  }
    // Validate password
  const isMatch = await bcrypt.compare(password, userFound.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Incorrect password. Try again." });
  }
     // Check if the user is blocked
  if (userFound.isBlocked) {
    return res.status(403).json({ message: "Your account is blocked. Contact support." });
  }
    if(userFound &&  await bcrypt.compare(password,userFound?.password)){
         res.status(200).json({msg:'login success', user: {
          isAdmin: userFound.isAdmin,
          name: userFound.name,
        },  token:generateToken(userFound?._id)})
       
    }else{
      throw new Error('invalid login')

    }
   
})
export const googleLogin =asyncHandler(async(req,res)=>{
  try {
    const{code}= req.query;
    
  const googleRes = await oauth2client.getToken(code)
 
  oauth2client.setCredentials(googleRes.tokens)
  const userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`)
 
const{email,name,picture}= userRes.data;
// Check if user exists, else create new user
let user = await User.findOne({ email });

if (!user) {
  user = await User.create({ email, name, isGoogleAuth: true, });
}
 // If the user is blocked, prevent login
 if (user.isBlocked) {
  return res.status(403).json({ message: "Your account is blocked. Contact support." });
}
const token = await generateToken(user?._id)
return res.status(200).json({
  message:'success',
  user,
  token
})
    
  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(500).json({  message: "Authentication failed" });
    
  }
  
})
export const updateShippingAddress = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    address,
    city,
    postalCode,
    phone,
    country,
  } = req.body;
  const user = await User.findByIdAndUpdate(
    req.userAuthId,
    { $push:{
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
  //send response
  res.json({
    status: "success",
    message: "User shipping address updated successfully",
    user,
  });
});

export const updateUserShippingAddress = asyncHandler(async (req, res) => {
  try {
    console.log("Received request body:", req.body);

    const { addressId } = req.params;
    const {...updatedAddress } = req.body
    
    

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
      { new: true } // Return updated user
    );

    if (!user) {
      return res.status(404).json({ message: "User or address not found" });
    }

    res.status(200).json({ message: "Shipping address updated", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
export const deleteUserShippingAddress = asyncHandler(async (req, res) => {
  try {
    const {  addressId } = req.params;
    console.log("Deleting address:",  addressId);

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
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export const getUserProfile = asyncHandler(async (req, res) => {
  //find the user
  const user = await User.findById(req.userAuthId)
  
  res.json({
    status: "success",
    message: "User profile fetched successfully",
    user,
  });
});
export const getAllUsers = asyncHandler(async (req, res) => {
  //find the user
  const users = await User.find()
 
  res.json({
    status: "success",
    message: "Users fetched successfully",
    users,
  });
});

export const blockUnblockUser = asyncHandler(async(req,res)=>{
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log('wrong id......................................................................................')
    }

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Toggle the isBlocked status
    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({ message: `User ${user.isBlocked ? "Blocked" : "Unblocked"} successfully`, user });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
})
// export const profilePage =asyncHandler(async(req,res)=>{
 
//     // res.status(200).json({msg:'profile page'})
    
//   res.json({
//     status: "success",
//     message: "User profile fetched successfully",
//     user,
//   });
// })