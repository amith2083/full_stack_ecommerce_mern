import express from 'express'

import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { createColor, deleteColor, getAllColors, getSingleColor, updateColor } from '../controllers/colorCtrl.js';
const colorRoute = express.Router()

colorRoute.post('/', isLoggedIn, createColor)
colorRoute.get('/', getAllColors)
colorRoute.get('/:id', isLoggedIn, getSingleColor)
colorRoute.put('/:id', isLoggedIn, updateColor)
colorRoute.delete('/:id', isLoggedIn, deleteColor)

export default colorRoute