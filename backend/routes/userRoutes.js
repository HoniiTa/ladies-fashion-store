import express from 'express';
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  getWishlist,
  toggleWishlist,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Cart routes
router.route('/cart')
  .get(protect, getCart)
  .post(protect, addToCart)
  .delete(protect, clearCart);

router.delete('/cart/:itemId', protect, removeFromCart);

// Wishlist routes
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/toggle', protect, toggleWishlist);

// Admin routes
router.get('/', protect, admin, getAllUsers);
router.route('/:id')
  .delete(protect, admin, deleteUser);
router.put('/:id/role', protect, admin, updateUserRole);

export default router;
