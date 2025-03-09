import exppress from "express";
import {
  createOrder,getAllorders,
  getOrderStats,
  getSingleOrder,
  retryPayment,
  updateOrder,
  updatePaymentFailure,
  verifyPayment
} from "../controllers/orderCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const orderRoute = exppress.Router();

orderRoute.get("/sales/stats", isLoggedIn, getOrderStats);
orderRoute.post("/", isLoggedIn, createOrder);
orderRoute.post("/payment-verify",isLoggedIn, verifyPayment);
orderRoute.put("/payment-failed",isLoggedIn, updatePaymentFailure);
orderRoute.post("/retry-payment",isLoggedIn, retryPayment);
orderRoute.get("/", isLoggedIn, getAllorders);
orderRoute.get("/:id", isLoggedIn, getSingleOrder);
orderRoute.put("/update/:id", isLoggedIn, updateOrder);
// orderRouter.get("/sales/stats", isLoggedIn, getOrderStatsCtrl);
// orderRouter.put("/update/:id", isLoggedIn, updateOrderCtrl);
// orderRouter.get("/:id", isLoggedIn, getSingleOrderCtrl);
export default orderRoute;