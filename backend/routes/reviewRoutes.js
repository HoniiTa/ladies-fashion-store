import express from 'express';
import {
  createReview,
  getProductReviews,
  getAllReviews,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createReview)
  .get(protect, admin, getAllReviews);

router.get('/product/:productId', getProductReviews);
router.delete('/:id', protect, deleteReview);

export default router;
