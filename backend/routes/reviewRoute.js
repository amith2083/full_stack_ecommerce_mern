import express from 'express'

import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { createReview } from '../controllers/reviewCtrl.js';

const reviewRoute = express.Router()

reviewRoute.post('/:id', isLoggedIn, createReview)


export default reviewRoute