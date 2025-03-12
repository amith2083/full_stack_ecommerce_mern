import express from 'express'
import { createBrand, deleteBrand, getAllBrands, getSingleBrand, updateBrand } from '../controllers/brandCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import isAdmin from '../middlewares/isAdmin.js';

const brandRoute = express.Router()

brandRoute.post('/', isLoggedIn, isAdmin, createBrand)
brandRoute.get('/', getAllBrands)
brandRoute.get('/:id', isLoggedIn, getSingleBrand)
brandRoute.put('/:id', isLoggedIn,isAdmin, updateBrand)
brandRoute.delete('/:id', isLoggedIn, isAdmin,deleteBrand)

export default brandRoute