import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Star, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const ProductCard = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [added, setAdded] = useState(false);

  const isFavorited = isInWishlist(product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M';
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : 'Navy';
    addToCart(product, 1, defaultSize, defaultColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const currentPrice = product.discountPrice || product.price;
  const originalPrice = product.discountPrice ? product.price : null;

  return (
    <div className="group relative bg-white border border-gray-100 hover:border-gold-500/40 transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-luxury">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-cream-100">
        <Link to={`/product/${product._id || product.slug}`}>
          <img
            src={product.coverImage || (product.images && product.images[0])}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNewArrival && (
            <span className="bg-navy-950/90 text-gold-300 text-[10px] tracking-widest uppercase font-semibold px-2.5 py-1 border border-gold-500/30">
              New Arrival
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 text-[10px] tracking-widest uppercase font-bold px-2.5 py-1 shadow-sm">
              Best Seller
            </span>
          )}
          {originalPrice && (
            <span className="bg-red-800 text-white text-[10px] tracking-wider uppercase font-semibold px-2 py-0.5">
              Save ${(originalPrice - currentPrice).toFixed(0)}
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
            isFavorited
              ? 'bg-red-50 text-red-600 border border-red-200'
              : 'bg-white/80 backdrop-blur-sm text-navy-900 hover:bg-white hover:text-gold-600'
          }`}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View overlay button */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-navy-950/80 via-navy-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="bg-white/90 hover:bg-white text-navy-950 text-xs px-3 py-2 flex items-center gap-1.5 uppercase tracking-wider font-medium shadow-md transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              Quick View
            </button>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-grow justify-between bg-white">
        <div>
          <div className="flex items-center justify-between text-[11px] text-gray-500 uppercase tracking-widest mb-1.5">
            <span>{product.categoryName || (product.category && product.category.name)}</span>
            <div className="flex items-center text-gold-500">
              <Star className="w-3 h-3 fill-gold-500 text-gold-500 mr-1" />
              <span className="font-semibold text-navy-900">{product.rating || 5.0}</span>
              <span className="text-gray-400 text-[10px] ml-1">({product.numReviews || 0})</span>
            </div>
          </div>

          <Link to={`/product/${product._id || product.slug}`}>
            <h3 className="font-serif text-base font-semibold text-navy-900 hover:text-gold-600 transition-colors line-clamp-1 mb-2">
              {product.name}
            </h3>
          </Link>

          <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-3">
            {product.description}
          </p>
        </div>

        <div>
          {/* Price & Action */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-lg font-bold text-navy-950">
                ${currentPrice.toFixed(2)}
              </span>
              {originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              className={`text-xs px-3.5 py-2 uppercase tracking-wider font-semibold transition-all duration-300 flex items-center gap-1.5 ${
                product.countInStock === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-navy-900 text-gold-200 hover:bg-gold-500 hover:text-navy-950'
              }`}
            >
              {product.countInStock === 0 ? (
                'Sold Out'
              ) : added ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Added
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" /> Add
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
