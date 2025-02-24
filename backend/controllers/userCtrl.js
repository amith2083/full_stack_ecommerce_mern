import User from "../model/User.js"; 
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcrypt'
import generateToken from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";
import sendEmail from "../utils/sendEmai.js";
import OTP from "../model/Otp.js";
import crypto from 'crypto'

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
    if(userFound &&  await bcrypt.compare(password,userFound?.password)){
         res.status(200).json({msg:'login success',userFound,  token:generateToken(userFound?._id)})
       
    }else{
      throw new Error('invalid login')

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
export const getUserProfile = asyncHandler(async (req, res) => {
  //find the user
  const user = await User.findById(req.userAuthId)
  res.json({
    status: "success",
    message: "User profile fetched successfully",
    user,
  });
});

// export const profilePage =asyncHandler(async(req,res)=>{
 
//     // res.status(200).json({msg:'profile page'})
    
//   res.json({
//     status: "success",
//     message: "User profile fetched successfully",
//     user,
//   });
// })