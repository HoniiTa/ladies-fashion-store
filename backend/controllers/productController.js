import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Review from '../models/Review.js';

// @desc    Fetch all products with search, filter, sort & pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;

    const query = {};

    // Search keyword
    if (req.query.keyword) {
      query.$or = [
        { name: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } },
      ];
    }

    // Category filter
    if (req.query.category && req.query.category !== 'all') {
      if (req.query.category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = req.query.category;
      } else {
        const foundCategory = await Category.findOne({
          $or: [
            { slug: req.query.category.toLowerCase() },
            { name: { $regex: new RegExp(`^${req.query.category}$`, 'i') } },
          ],
        });
        if (foundCategory) {
          query.category = foundCategory._id;
        } else {
          // If category not found, match categoryName
          query.categoryName = { $regex: new RegExp(req.query.category, 'i') };
        }
      }
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // Featured / New Arrival / Best Seller filter
    if (req.query.featured === 'true') {
      query.isFeatured = true;
    }
    if (req.query.newArrival === 'true') {
      query.isNewArrival = true;
    }
    if (req.query.bestSeller === 'true') {
      query.isBestSeller = true;
    }

    // In stock filter
    if (req.query.inStock === 'true') {
      query.countInStock = { $gt: 0 };
    }

    // Sort options
    let sortOption = { createdAt: -1 }; // default newest
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price-low':
          sortOption = { price: 1 };
          break;
        case 'price-high':
          sortOption = { price: -1 };
          break;
        case 'rating':
          sortOption = { rating: -1 };
          break;
        case 'popular':
          sortOption = { numReviews: -1, rating: -1 };
          break;
        case 'oldest':
          sortOption = { createdAt: 1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }
    }

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      totalProducts: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by ID or Slug
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    let product;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(req.params.id).populate('category', 'name slug');
    } else {
      product = await Product.findOne({ slug: req.params.id }).populate('category', 'name slug');
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get reviews for this product
    const reviews = await Review.find({ product: product._id }).sort({ createdAt: -1 });

    // Find related products in the same category
    const relatedProducts = await Product.find({
      category: product.category._id || product.category,
      _id: { $ne: product._id },
    })
      .limit(4)
      .populate('category', 'name slug');

    res.json({
      ...product.toObject(),
      reviews,
      relatedProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get featured products for luxury showcase
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true })
      .limit(8)
      .populate('category', 'name slug');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get new arrivals
// @route   GET /api/products/new-arrivals
// @access  Public
export const getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find({ isNewArrival: true })
      .sort({ createdAt: -1 })
      .limit(8)
      .populate('category', 'name slug');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      discountPrice,
      images,
      coverImage,
      sizes,
      colors,
      material,
      countInStock,
      isFeatured,
      isNewArrival,
      isBestSeller,
      careInstructions,
    } = req.body;

    // Check category exists
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(400).json({ message: 'Invalid category specified' });
    }

    const product = new Product({
      name,
      description,
      category: categoryDoc._id,
      categoryName: categoryDoc.name,
      price,
      discountPrice: discountPrice || null,
      images: Array.isArray(images) && images.length > 0 ? images : [coverImage || 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80'],
      coverImage: coverImage || (images && images[0]) || 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
      sizes: sizes || ['S', 'M', 'L', 'XL'],
      colors: colors || ['Navy', 'Gold'],
      material: material || 'Finest Silk & Metallic Brocade',
      countInStock: countInStock !== undefined ? countInStock : 10,
      isFeatured: Boolean(isFeatured),
      isNewArrival: Boolean(isNewArrival),
      isBestSeller: Boolean(isBestSeller),
      careInstructions: careInstructions || 'Dry clean only',
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let categoryName = product.categoryName;
    if (req.body.category && req.body.category !== String(product.category)) {
      const categoryDoc = await Category.findById(req.body.category);
      if (categoryDoc) {
        product.category = categoryDoc._id;
        categoryName = categoryDoc.name;
      }
    }

    product.name = req.body.name ?? product.name;
    product.description = req.body.description ?? product.description;
    product.categoryName = categoryName;
    product.price = req.body.price !== undefined ? req.body.price : product.price;
    product.discountPrice = req.body.discountPrice !== undefined ? req.body.discountPrice : product.discountPrice;
    product.images = req.body.images ?? product.images;
    product.coverImage = req.body.coverImage ?? product.coverImage;
    product.sizes = req.body.sizes ?? product.sizes;
    product.colors = req.body.colors ?? product.colors;
    product.material = req.body.material ?? product.material;
    product.countInStock = req.body.countInStock !== undefined ? req.body.countInStock : product.countInStock;
    product.isFeatured = req.body.isFeatured !== undefined ? req.body.isFeatured : product.isFeatured;
    product.isNewArrival = req.body.isNewArrival !== undefined ? req.body.isNewArrival : product.isNewArrival;
    product.isBestSeller = req.body.isBestSeller !== undefined ? req.body.isBestSeller : product.isBestSeller;
    product.careInstructions = req.body.careInstructions ?? product.careInstructions;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    await Review.deleteMany({ product: req.params.id });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
