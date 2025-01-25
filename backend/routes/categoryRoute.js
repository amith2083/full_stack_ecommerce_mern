import express from 'express'
import { createCategory, deleteCategory, getAllCategories, getSingleCategory, updateCategory } from '../controllers/categoryCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import categoryFileUpload from '../config/categoryUpload.js';
import isAdmin from '../middlewares/isAdmin.js';
const categoryRoute = express.Router()

categoryRoute.post('/', isLoggedIn, isAdmin,categoryFileUpload.single('file'), createCategory)
categoryRoute.get('/',  isLoggedIn,getAllCategories)
categoryRoute.get('/:id', isLoggedIn, getSingleCategory)
categoryRoute.put('/:id', isLoggedIn,isAdmin, updateCategory)
categoryRoute.delete('/:id', isLoggedIn, isAdmin,deleteCategory)

export default categoryRoute