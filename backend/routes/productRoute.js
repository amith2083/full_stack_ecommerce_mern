import express from "express";
import { createProduct,getProducts, listUnListProduct, singleProduct, updateProduct } from "../controllers/ProductCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";
import upload from "../config/productUpload.js";

const productRoute = express.Router()




productRoute.post('/', isLoggedIn, isAdmin, upload.array('files') ,createProduct);
productRoute.get('/',getProducts)
productRoute.get('/:id',singleProduct)
productRoute.put('/:id',isLoggedIn,isAdmin, upload.array("files"),updateProduct)
productRoute.put('/list-unlist/:id',isLoggedIn,isAdmin, listUnListProduct)

export default productRoute;