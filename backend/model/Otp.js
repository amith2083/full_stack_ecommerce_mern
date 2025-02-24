import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // OTP expires in 5 minutes (300 seconds)
  },
});

const OTP = mongoose.model("OTP", otpSchema);
export default OTP;
