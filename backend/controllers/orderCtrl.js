import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";
import Order from "../model/Order.js";
import Product from "../model/Product.js";
import User from "../model/User.js";


export const createOrderCtrl = asyncHandler(async (req, res) => {
   
    const { orderItems, shippingAddress, totalPrice } = req.body;
    console.log(req.body);
    //Find the user
    const user = await User.findById(req.userAuthId);
    //Check if user has shipping address
    if (!user?.hasShippingAddress) {
      throw new Error("Please provide shipping address");
    }
    //Check if order is not empty
    if (orderItems?.length <= 0) {
      throw new Error("No Order Items");
    }
    //Place/create order - save into DB
    const order = await Order.create({
      user: user?._id,
      orderItems,
      shippingAddress,
      // totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice,
      totalPrice,
    });
  
    //Update the product qty
    const products = await Product.find({ _id: { $in: orderItems } });
  
    orderItems?.map(async (order) => {
      const product = products?.find((product) => {
        return product?._id?.toString() === order?._id?.toString();
      });
      if (product) {
        product.totalSold += order.qty;
      }
      await product.save();
    });
    //push order into user
    user.orders.push(order?._id);
    await user.save();
  
    //make payment (stripe)
    //convert order items to have same structure that stripe need
    const convertedOrders = orderItems.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item?.name,
            description: item?.description,
          },
          unit_amount: item?.price * 100,
        },
        quantity: item?.qty,
      };
    });
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
  });
  