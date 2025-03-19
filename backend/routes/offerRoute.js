
import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";
import { blockOffer, createOffer, getAllOffers, unblockOffer } from "../controllers/offerCtrl.js";
const offerRoute= express.Router()


offerRoute.get("/",  getAllOffers);
offerRoute.post("/", isLoggedIn,isAdmin, createOffer);
offerRoute.put("/block-offer/:id", isLoggedIn,isAdmin, blockOffer);
offerRoute.put("/unblock-offer/:id", isLoggedIn,isAdmin, unblockOffer);

export default offerRoute;