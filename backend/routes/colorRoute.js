import express from 'express'

import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import isAdmin from '../middlewares/isAdmin.js';
import { createColor, deleteColor, getAllColors, getSingleColor, updateColor } from '../controllers/colorCtrl.js';
const colorRoute = express.Router()

colorRoute.post('/', isLoggedIn, isAdmin,createColor)
colorRoute.get('/', getAllColors)
colorRoute.get('/:id', getSingleColor)
colorRoute.put('/:id', isLoggedIn,isAdmin, updateColor)
colorRoute.delete('/:id', isLoggedIn,isAdmin, deleteColor)

export default colorRoute