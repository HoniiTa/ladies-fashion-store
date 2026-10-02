import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/ProductCard';

export const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user, isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Accordion toggles
  const [activeTab, setActiveTab] = useState('description');

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await api.get(`/products/${id}`);
      setProduct(data);
      setSelectedImage(data.coverImage || (data.images && data.images[0]) || '');
      setSelectedSize(data.sizes && data.sizes.length > 0 ? data.sizes[0] : 'M');
      setSelectedColor(data.colors && data.colors.length > 0 ? data.colors[0] : 'Navy');
    } catch (err) {
      console.error('Failed to load product:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setReviewError('Please sign in to write an artisan critique');
      return;
    }
    setSubmittingReview(true);
    setReviewError('');
    setReviewSuccess('');

    try {
      await api.post('/reviews', {
        productId: product._id,
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      });
      setReviewSuccess('Your review has been published with gratitude.');
      setReviewTitle('');
      setReviewComment('');
      // Reload product data to update reviews and rating
      await loadProduct();
    } catch (err) {
      setReviewError(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FDFBF7]">
        <div className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin mb-4" />
        <span className="font-serif uppercase tracking-widest text-xs text-gray-500">
          Unveiling Creation...
        </span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-3xl font-bold text-navy-950 mb-4">Product Not Found</h2>
        <p className="text-gray-500 text-xs mb-6">
          The requested creation may have been archived or retired from our boutique.
        </p>
        <Link to="/shop" className="btn-gold">
          Return to Boutique
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product._id);
  const currentPrice = product.discountPrice || product.price;

  return (
    <div className="bg-[#FDFBF7] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-xs uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-2">
          <Link to="/" className="hover:text-gold-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-gold-600 transition-colors">
            Shop
          </Link>
          <span>/</span>
          <Link
            to={`/shop?category=${encodeURIComponent(product.categoryName)}`}
            className="hover:text-gold-600 transition-colors"
          >
            {product.categoryName}
          </Link>
          <span>/</span>
          <span className="text-navy-900 font-semibold truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* Main Product Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
          {/* Left: Gallery Column */}
          <div>
            <div className="aspect-[3/4] overflow-hidden bg-cream-100 border border-gold-500/30 shadow-lg relative mb-4">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              {product.isNewArrival && (
                <span className="absolute top-4 left-4 bg-navy-950 text-gold-300 text-xs uppercase font-semibold px-3 py-1.5 tracking-widest border border-gold-500/30">
                  New Arrival
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-24 flex-shrink-0 border-2 overflow-hidden transition-all ${
                      selectedImage === img
                        ? 'border-gold-500 scale-105 shadow-md'
                        : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details Column */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs uppercase tracking-widest text-gold-600 font-semibold mb-2">
                <span>{product.categoryName}</span>
                <div className="flex items-center text-gold-500">
                  <Star className="w-4 h-4 fill-gold-500 text-gold-500 mr-1" />
                  <span className="font-bold text-navy-950">{product.rating}</span>
                  <span className="text-gray-400 ml-1">({product.numReviews} Reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy-950 leading-tight mb-4">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-4 mb-6">
                <span className="font-serif text-3xl font-bold text-navy-950">
                  ${currentPrice.toFixed(2)}
                </span>
                {product.discountPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                )}
                {product.discountPrice && (
                  <span className="text-xs bg-red-100 text-red-800 font-semibold px-2.5 py-1">
                    Special Offer
                  </span>
                )}
              </div>

              {/* Description summary */}
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6 font-light">
                {product.description}
              </p>

              {/* Material Highlight */}
              <div className="bg-cream-100 p-3.5 border-l-4 border-gold-500 mb-6 text-xs text-navy-950">
                <span className="font-semibold uppercase tracking-wider block mb-0.5">
                  Artisan Composition:
                </span>
                <span className="text-gray-700">{product.material}</span>
              </div>

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between items-center text-xs mb-2.5">
                    <span className="font-bold uppercase tracking-wider text-navy-950">
                      Select Size:
                    </span>
                    <span className="text-gray-500 font-medium">{selectedSize}</span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`text-xs px-4 py-2 border transition-all ${
                          selectedSize === size
                            ? 'bg-navy-950 text-gold-300 border-navy-950 font-bold shadow-md'
                            : 'border-gray-300 text-gray-800 hover:border-gold-500'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between items-center text-xs mb-2.5">
                    <span className="font-bold uppercase tracking-wider text-navy-950">
                      Select Palette:
                    </span>
                    <span className="text-gray-500 font-medium">{selectedColor}</span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`text-xs px-4 py-1.5 border transition-all ${
                          selectedColor === color
                            ? 'bg-navy-950 text-gold-300 border-navy-950 font-semibold shadow-md'
                            : 'border-gray-300 text-gray-800 hover:border-gold-500'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Stock Status */}
              <div className="flex items-center gap-6 mb-8">
                <div className="flex items-center border border-gray-300 bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2.5 text-navy-950 hover:bg-gray-100 font-bold"
                  >
                    -
                  </button>
                  <span className="px-5 py-2.5 text-xs font-bold text-navy-950">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))}
                    className="px-4 py-2.5 text-navy-950 hover:bg-gray-100 font-bold"
                  >
                    +
                  </button>
                </div>

                <div className="text-xs">
                  {product.countInStock > 0 ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      In Boutique Stock ({product.countInStock} items ready to ship)
                    </span>
                  ) : (
                    <span className="text-red-600 font-semibold">Currently Out of Stock</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions & Guarantee */}
            <div>
              <div className="flex gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={product.countInStock === 0}
                  className={`flex-1 py-4 px-8 text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 ${
                    product.countInStock === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : added
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'btn-gold shadow-gold-subtle'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Shopping Bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Add to Shopping Bag
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-4 border transition-colors ${
                    isFavorited
                      ? 'border-red-400 bg-red-50 text-red-600'
                      : 'border-gray-300 text-gray-700 hover:border-gold-500 hover:text-gold-600'
                  }`}
                  aria-label="Wishlist toggle"
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-3 border-t border-gray-200 pt-6 text-[11px] text-gray-600 text-center">
                <div className="flex flex-col items-center">
                  <Truck className="w-4 h-4 text-gold-600 mb-1" />
                  <span>Complimentary Delivery</span>
                </div>
                <div className="flex flex-col items-center">
                  <ShieldCheck className="w-4 h-4 text-gold-600 mb-1" />
                  <span>100% Authentic Haute Couture</span>
                </div>
                <div className="flex flex-col items-center">
                  <RotateCcw className="w-4 h-4 text-gold-600 mb-1" />
                  <span>30-Day White-Glove Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <div className="border border-gray-200 bg-white mb-20 shadow-sm">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab('description')}
              className={`py-4 px-6 text-xs uppercase tracking-widest font-semibold transition-all whitespace-nowrap ${
                activeTab === 'description'
                  ? 'border-b-2 border-gold-500 text-navy-950 bg-cream-50'
                  : 'text-gray-500 hover:text-navy-950'
              }`}
            >
              Couture Details
            </button>
            <button
              onClick={() => setActiveTab('care')}
              className={`py-4 px-6 text-xs uppercase tracking-widest font-semibold transition-all whitespace-nowrap ${
                activeTab === 'care'
                  ? 'border-b-2 border-gold-500 text-navy-950 bg-cream-50'
                  : 'text-gray-500 hover:text-navy-950'
              }`}
            >
              Fabric & Care
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`py-4 px-6 text-xs uppercase tracking-widest font-semibold transition-all whitespace-nowrap ${
                activeTab === 'shipping'
                  ? 'border-b-2 border-gold-500 text-navy-950 bg-cream-50'
                  : 'text-gray-500 hover:text-navy-950'
              }`}
            >
              Delivery & White-Glove Service
            </button>
          </div>

          <div className="p-8 text-xs sm:text-sm text-gray-700 leading-relaxed font-light">
            {activeTab === 'description' && (
              <div className="space-y-4">
                <p>{product.description}</p>
                <p>
                  Each piece is handcrafted by master artisans who specialize in delicate haute
                  couture techniques, ensuring that each cut, fold, and embroidery stitch meets our
                  uncompromising standards of perfection.
                </p>
              </div>
            )}
            {activeTab === 'care' && (
              <div className="space-y-4">
                <p className="font-semibold text-navy-950">Materials:</p>
                <p>{product.material}</p>
                <p className="font-semibold text-navy-950 pt-2">Preservation & Care Instructions:</p>
                <p>{product.careInstructions}</p>
              </div>
            )}
            {activeTab === 'shipping' && (
              <div className="space-y-4">
                <p>
                  <strong>Complimentary Express Delivery:</strong> All orders over $150 include
                  expedited, fully tracked courier delivery with signature confirmation.
                </p>
                <p>
                  <strong>Packaging:</strong> Arrives in our signature navy blue presentation box,
                  tied with hand-embossed gold ribbon and wrapped in archival acid-free tissue paper.
                </p>
                <p>
                  <strong>Returns:</strong> We offer a 30-day complimentary return window for all
                  unworn pieces with original security tags attached.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="bg-white border border-gray-200 p-8 sm:p-12 mb-20 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-200 pb-6">
            <div>
              <span className="text-[11px] uppercase tracking-[0.3em] text-gold-600 font-semibold block mb-1">
                Client Testimonies
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy-950">
                Customer Reviews & Critiques
              </h2>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <div className="flex text-gold-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(product.rating || 5)
                        ? 'fill-gold-500 text-gold-500'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-serif text-xl font-bold text-navy-950">
                {product.rating} out of 5
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-6">
              {!product.reviews || product.reviews.length === 0 ? (
                <p className="text-gray-500 text-xs italic">
                  Be the first esteemed patron to leave a critique for this creation.
                </p>
              ) : (
                product.reviews.map((rev) => (
                  <div key={rev._id} className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-navy-100 border border-gold-500/40">
                          <img
                            src={rev.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                            alt={rev.userName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-serif text-xs font-bold text-navy-950">
                            {rev.userName}
                          </h4>
                          {rev.isVerifiedPurchase && (
                            <span className="text-[10px] text-emerald-700 font-medium">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex text-gold-500 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-gold-500 text-gold-500' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>

                    <h5 className="font-serif text-sm font-semibold text-navy-950 mb-1">
                      {rev.title}
                    </h5>
                    <p className="text-xs text-gray-600 leading-relaxed font-light">
                      {rev.comment}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Write a Review Box */}
            <div className="bg-cream-50 p-6 border border-gold-500/30">
              <h3 className="font-serif text-lg font-bold text-navy-950 mb-2">
                Write a Review
              </h3>
              <p className="text-xs text-gray-500 mb-4 font-light">
                Share your personal critique on silhouette, fabric, and fit.
              </p>

              {reviewSuccess && (
                <div className="bg-emerald-50 text-emerald-800 text-xs p-3 border border-emerald-200 mb-4">
                  {reviewSuccess}
                </div>
              )}
              {reviewError && (
                <div className="bg-red-50 text-red-700 text-xs p-3 border border-red-200 mb-4">
                  {reviewError}
                </div>
              )}

              {isAuthenticated ? (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-navy-950 mb-1">
                      Your Rating:
                    </label>
                    <div className="flex gap-1 text-gold-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= reviewRating
                                ? 'fill-gold-500 text-gold-500'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-navy-950 mb-1">
                      Review Title:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pure royalty in person"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-gray-300 focus:outline-none focus:border-gold-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-navy-950 mb-1">
                      Comments & Critique:
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Describe the fabric texture, weight, drape, and your experience..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-gray-300 focus:outline-none focus:border-gold-500 bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full btn-gold py-2.5 text-xs font-bold"
                  >
                    {submittingReview ? 'Publishing...' : 'Submit Critique'}
                  </button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <p className="text-xs text-gray-500 mb-3">
                    Please log into your account to submit a review.
                  </p>
                  <Link to="/login" className="btn-navy py-2 px-6 text-xs inline-block">
                    Sign In to Review
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <div className="mb-12">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-[11px] uppercase tracking-[0.3em] text-gold-600 font-semibold block mb-1">
                Complementary Pieces
              </span>
              <h2 className="font-serif text-3xl font-bold text-navy-950">
                You May Also Admire
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {product.relatedProducts.map((rel) => (
                <ProductCard key={rel._id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
