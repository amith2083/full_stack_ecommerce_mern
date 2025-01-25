import User from "../model/User.js"; 
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcrypt'
import generateToken from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

export const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
    throw new Error ("user already exists");
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await  bcrypt.hash(password,salt)
  
    const user = await User.create({
      name,
      email,
      password:hashedPassword,
    });
    res
      .status(201)
      .json({
        status: "success",
        msg: "user registered successfully",
        data: user,
      
      });
  })


export const login = asyncHandler(async(req,res)=>{
    const{email,password}= req.body
    const userFound = await User.findOne({email});
    if(userFound &&  await bcrypt.compare(password,userFound?.password)){
         res.status(200).json({msg:'login success',userFound,  token:generateToken(userFound?._id)})
       
    }else{
      throw new Error('invalid login')

    }
   
})
export const profilePage =asyncHandler(async(req,res)=>{
 
    res.status(200).json({msg:'profile page'})
})