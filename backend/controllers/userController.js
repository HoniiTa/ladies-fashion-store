import User from '../models/User.js';
import Product from '../models/Product.js';

// @desc    Get user's cart
// @route   GET /api/users/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'cart.product',
      select: 'name price discountPrice coverImage countInStock slug categoryName',
    });

    res.json(user.cart || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart or update quantity
// @route   POST /api/users/cart
// @access  Private
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, selectedSize = 'M', selectedColor = 'Navy' } = req.body;

    const user = await User.findById(req.user._id);
    const existingIndex = user.cart.findIndex(
      (item) =>
        String(item.product) === String(productId) &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );

    if (existingIndex > -1) {
      user.cart[existingIndex].quantity += Number(quantity);
    } else {
      user.cart.push({
        product: productId,
        quantity: Number(quantity),
        selectedSize,
        selectedColor,
      });
    }

    await user.save();
    
    // Return populated cart
    const populated = await User.findById(req.user._id).populate({
      path: 'cart.product',
      select: 'name price discountPrice coverImage countInStock slug categoryName',
    });

    res.json(populated.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/users/cart/:itemId
// @access  Private
export const removeFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter((item) => String(item._id) !== req.params.itemId);
    await user.save();

    const populated = await User.findById(req.user._id).populate({
      path: 'cart.product',
      select: 'name price discountPrice coverImage countInStock slug categoryName',
    });

    res.json(populated.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/users/cart
// @access  Private
export const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();
    res.json([]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's wishlist
// @route   GET /api/users/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'wishlist',
      populate: { path: 'category', select: 'name slug' },
    });

    res.json(user.wishlist || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle wishlist item (add if not exists, remove if exists)
// @route   POST /api/users/wishlist/toggle
// @access  Private
export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    const exists = user.wishlist.some((id) => String(id) === String(productId));

    if (exists) {
      user.wishlist = user.wishlist.filter((id) => String(id) !== String(productId));
    } else {
      user.wishlist.push(productId);
    }

    await user.save();

    const populated = await User.findById(req.user._id).populate({
      path: 'wishlist',
      populate: { path: 'category', select: 'name slug' },
    });

    res.json({
      wishlist: populated.wishlist,
      isWishlisted: !exists,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user role or status (Admin only)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role || user.role;
    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (String(user._id) === String(req.user._id)) {
      return res.status(400).json({ message: 'You cannot delete yourself' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
