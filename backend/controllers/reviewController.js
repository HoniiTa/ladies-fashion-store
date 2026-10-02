import Review from '../models/Review.js';
import Product from '../models/Product.js';

// @desc    Create new review for product
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment, title } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = await Review.create({
      user: req.user._id,
      userName: req.user.name,
      userAvatar: req.user.avatar,
      product: productId,
      rating: Number(rating),
      title: title || 'Exceptional Piece',
      comment,
      isVerifiedPurchase: true,
    });

    // Update product rating and reviews count
    const allReviews = await Review.find({ product: productId });
    product.numReviews = allReviews.length;
    product.rating = Number(
      (allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length).toFixed(1)
    );
    await product.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews (Admin only)
// @route   GET /api/reviews
// @access  Private/Admin
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate('product', 'name coverImage slug')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private (Admin or Review Owner)
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (String(review.user) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    const productId = review.product;
    await Review.findByIdAndDelete(req.params.id);

    // Recalculate rating
    const product = await Product.findById(productId);
    if (product) {
      const remainingReviews = await Review.find({ product: productId });
      product.numReviews = remainingReviews.length;
      product.rating =
        remainingReviews.length > 0
          ? Number((remainingReviews.reduce((acc, item) => item.rating + acc, 0) / remainingReviews.length).toFixed(1))
          : 5.0;
      await product.save();
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
