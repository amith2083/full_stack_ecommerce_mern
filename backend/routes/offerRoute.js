
import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";
import {  createOffer, getAllOffers, getOffer, listUnListOffer, updateOffer } from "../controllers/offerCtrl.js";
const offerRoute= express.Router()


offerRoute.get("/",  getAllOffers);
offerRoute.post("/", isLoggedIn,isAdmin, createOffer);
offerRoute.get("/single", isLoggedIn,isAdmin, getOffer);

offerRoute.put("/:id", isLoggedIn,isAdmin,updateOffer);

offerRoute.put('/list-unlist/:id',isLoggedIn,isAdmin, listUnListOffer)

export default offerRoute;