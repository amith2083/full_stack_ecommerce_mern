import exppress from "express";
import {
  createOrder,getAllorders,
  retryPayment,
  updatePaymentFailure,
  verifyPayment
} from "../controllers/orderCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const orderRoute = exppress.Router();

orderRoute.post("/", isLoggedIn, createOrder);
orderRoute.post("/payment-verify",isLoggedIn, verifyPayment);
orderRoute.post("/payment-failed",isLoggedIn, updatePaymentFailure);
orderRoute.post("/retry-payment",isLoggedIn, retryPayment);
orderRoute.get("/", isLoggedIn, getAllorders);
// orderRouter.get("/sales/stats", isLoggedIn, getOrderStatsCtrl);
// orderRouter.put("/update/:id", isLoggedIn, updateOrderCtrl);
// orderRouter.get("/:id", isLoggedIn, getSingleOrderCtrl);
export default orderRoute;