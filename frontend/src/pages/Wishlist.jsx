import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export const Wishlist = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="bg-[#FDFBF7] min-h-[75vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-cream-100 border border-gold-500/30 flex items-center justify-center mb-6 text-gold-600">
          <Heart className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-navy-950 mb-3">
          Your Curated Wishlist Is Empty
        </h2>
        <p className="text-gray-500 text-xs sm:text-sm max-w-md mx-auto mb-8 font-light leading-relaxed">
          Save your most admired couture evening gowns, royal abayas, and precious accessories to
          revisit anytime.
        </p>
        <Link to="/shop" className="btn-gold flex items-center gap-2">
          Discover The Catalog
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[11px] uppercase tracking-[0.3em] text-gold-600 font-semibold block mb-1">
            Private Dressing Room
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy-950 mb-3">
            Your Wishlist ({wishlist.length})
          </h1>
          <p className="text-xs text-gray-500">
            Easily transfer your saved pieces into your shopping bag.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => {
            const currentPrice = product.discountPrice || product.price;
            return (
              <div
                key={product._id}
                className="bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-[3/4] bg-cream-100 overflow-hidden">
                  <Link to={`/product/${product._id || product.slug}`}>
                    <img
                      src={product.coverImage || (product.images && product.images[0])}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-red-500 flex items-center justify-center shadow-md hover:bg-white transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 flex flex-col flex-grow justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-gold-600 font-semibold block mb-1">
                      {product.categoryName}
                    </span>
                    <Link to={`/product/${product._id || product.slug}`}>
                      <h3 className="font-serif text-base font-semibold text-navy-950 hover:text-gold-600 line-clamp-1 mb-2">
                        {product.name}
                      </h3>
                    </Link>
                  </div>

                  <div>
                    <div className="flex items-baseline justify-between mb-4">
                      <span className="font-serif text-lg font-bold text-navy-950">
                        ${currentPrice.toFixed(2)}
                      </span>
                      {product.discountPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M';
                        const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : 'Navy';
                        addToCart(product, 1, defaultSize, defaultColor);
                      }}
                      className="w-full btn-gold py-2.5 text-xs flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Move To Bag
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
