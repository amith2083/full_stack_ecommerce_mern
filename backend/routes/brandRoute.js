import express from 'express'
import { createBrand, deleteBrand, getAllBrands, getSingleBrand, updateBrand } from '../controllers/brandCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const brandRoute = express.Router()

brandRoute.post('/', isLoggedIn, createBrand)
brandRoute.get('/', getAllBrands)
brandRoute.get('/:id', isLoggedIn, getSingleBrand)
brandRoute.put('/:id', isLoggedIn, updateBrand)
brandRoute.delete('/:id', isLoggedIn, deleteBrand)

export default brandRoute