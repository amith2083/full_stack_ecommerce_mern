import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import dbConnect from "../config/dbConnect.js";
import userRoutes from "../routes/userRoute.js";
import productRoute from "../routes/productRoute.js";
import categoryRoute from "../routes/categoryRoute.js";
import orderRoute from "../routes/orderRoute.js";
import reviewRoute from "../routes/reviewRoute.js";
import {
  globalErrHandler,
  notFound,
} from "../middlewares/globalErrorHandler.js";
import brandRoute from "../routes/brandRoute.js";
import colorRoute from "../routes/colorRoute.js";

import cartRoute from "../routes/cartRoute.js";
import couponRoute from "../routes/couponRoute.js";
import wishListRoute from "../routes/wishList.js";
import walletRoute from "../routes/walletRoute.js";
import offerRoute from "../routes/offerRoute.js";
const app = express();

dbConnect();
app.use(express.json());

app.use(
  cors({
    origin: "https://trendzcart.vercel.app", // Allow only your frontend
    credentials: true, // Allow cookies and authentication headers
  })
);

app.use("/user", userRoutes);
app.use("/product", productRoute);
app.use("/category", categoryRoute);
app.use("/brand", brandRoute);
app.use("/color", colorRoute);
app.use("/cart", cartRoute);
app.use("/review", reviewRoute);
app.use("/coupon", couponRoute);
app.use("/order", orderRoute);
app.use("/wishlist", wishListRoute);
app.use("/wallet", walletRoute);
app.use("/offer", offerRoute);

app.use(notFound);
app.use(globalErrHandler);

const PORT = process.env.PORT || 7001;

app.listen(PORT, () => {
  console.log(`server is running on port no: ${PORT}`);
});
