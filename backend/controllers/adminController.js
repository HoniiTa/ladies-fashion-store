import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Category from '../models/Category.js';

// @desc    Get dashboard statistics for admin
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalProducts = await Product.countDocuments({});
    const totalCategories = await Category.countDocuments({});
    const totalOrders = await Order.countDocuments({});

    // Calculate total revenue from paid or delivered orders
    const revenueAggregate = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueAggregate.length > 0 ? revenueAggregate[0].total : 0;

    // Order status counts
    const statusCounts = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
    ]);

    // Low stock products (less than 5)
    const lowStockProducts = await Product.find({ countInStock: { $lte: 5 } })
      .select('name countInStock coverImage price')
      .limit(5);

    // Recent orders
    const recentOrders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      totalUsers,
      totalProducts,
      totalCategories,
      totalOrders,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      statusCounts,
      lowStockProducts,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
