import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please specify a category'],
    },
    categoryName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: 0,
    },
    discountPrice: {
      type: Number,
      default: null,
      min: 0,
    },
    images: {
      type: [String],
      required: [true, 'Please provide at least one product image'],
      validate: [val => val.length > 0, 'Must have at least one image'],
    },
    coverImage: {
      type: String,
      default: function () {
        return this.images && this.images.length > 0 ? this.images[0] : '';
      },
    },
    sizes: {
      type: [String],
      default: ['S', 'M', 'L', 'XL'],
    },
    colors: {
      type: [String],
      default: ['Navy Blue', 'Champagne Gold'],
    },
    material: {
      type: String,
      default: 'Pure Silk & Handcrafted Gold Thread Embroidery',
    },
    countInStock: {
      type: Number,
      required: true,
      default: 15,
      min: 0,
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    careInstructions: {
      type: String,
      default: 'Dry clean only to maintain rich texture and embroidery.',
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre('save', function (next) {
  if (this.name) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
  if (!this.coverImage && this.images && this.images.length > 0) {
    this.coverImage = this.images[0];
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;
