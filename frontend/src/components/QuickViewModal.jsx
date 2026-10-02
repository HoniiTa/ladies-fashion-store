import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const QuickViewModal = ({ product, onClose }) => {
  if (!product) return null;

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedImage, setSelectedImage] = useState(
    product.coverImage || (product.images && product.images[0])
  );
  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M'
  );
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0] : 'Navy'
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const isFavorited = isInWishlist(product._id);
  const currentPrice = product.discountPrice || product.price;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative bg-white w-full max-w-4xl shadow-2xl border border-gold-500/40 overflow-hidden my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-navy-950/70 hover:bg-navy-950 text-gold-300 p-2 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery Side */}
          <div className="p-6 bg-cream-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-100">
            <div className="aspect-[3/4] overflow-hidden bg-white border border-gold-500/20 shadow-sm relative mb-4">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.isNewArrival && (
                <span className="absolute top-3 left-3 bg-navy-950 text-gold-300 text-[10px] uppercase font-semibold px-2 py-1 tracking-widest border border-gold-500/30">
                  New Arrival
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-20 flex-shrink-0 border-2 overflow-hidden transition-all ${
                      selectedImage === img
                        ? 'border-gold-500 scale-105 shadow-sm'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Side */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 uppercase tracking-widest mb-2">
                <span>{product.categoryName}</span>
                <div className="flex items-center text-gold-500">
                  <Star className="w-4 h-4 fill-gold-500 text-gold-500 mr-1" />
                  <span className="font-bold text-navy-950">{product.rating || 5.0}</span>
                  <span className="text-gray-400 ml-1">({product.numReviews || 0} reviews)</span>
                </div>
              </div>

              <h2 className="font-serif text-2xl font-bold text-navy-950 mb-2">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-serif text-2xl font-bold text-navy-950">
                  ${currentPrice.toFixed(2)}
                </span>
                {product.discountPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                )}
                {product.discountPrice && (
                  <span className="text-xs bg-red-100 text-red-800 font-semibold px-2 py-0.5 rounded">
                    Save ${(product.price - product.discountPrice).toFixed(0)}
                  </span>
                )}
              </div>

              <p className="text-gray-600 text-xs leading-relaxed mb-4">
                {product.description}
              </p>

              <div className="text-xs text-navy-900 bg-cream-100 p-2.5 border-l-2 border-gold-500 mb-5">
                <span className="font-semibold">Material:</span> {product.material}
              </div>

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="font-semibold uppercase tracking-wider text-navy-950">Select Size:</span>
                    <span className="text-gray-500">{selectedSize}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`text-xs px-3.5 py-1.5 border transition-all ${
                          selectedSize === size
                            ? 'bg-navy-950 text-gold-300 border-navy-950 font-bold'
                            : 'border-gray-200 text-gray-700 hover:border-gold-500'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-5">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="font-semibold uppercase tracking-wider text-navy-950">Select Palette:</span>
                    <span className="text-gray-500">{selectedColor}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`text-xs px-3 py-1 border transition-all ${
                          selectedColor === color
                            ? 'bg-navy-950 text-gold-300 border-navy-950 font-semibold'
                            : 'border-gray-200 text-gray-700 hover:border-gold-500'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Stock */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-gray-300">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-navy-950 hover:bg-gray-100 font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-semibold text-navy-950">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))}
                    className="px-3 py-1.5 text-navy-950 hover:bg-gray-100 font-bold"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-gray-500">
                  {product.countInStock > 0 ? (
                    <span className="text-emerald-700 font-medium">In Stock ({product.countInStock} available)</span>
                  ) : (
                    <span className="text-red-600 font-medium">Out of Stock</span>
                  )}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div>
              <div className="flex gap-3 mb-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.countInStock === 0}
                  className={`flex-1 py-3 px-6 text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 ${
                    product.countInStock === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : added
                      ? 'bg-emerald-600 text-white'
                      : 'btn-gold'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Add to Shopping Bag
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 border transition-colors ${
                    isFavorited
                      ? 'border-red-400 bg-red-50 text-red-600'
                      : 'border-gray-300 text-gray-600 hover:border-gold-500 hover:text-gold-600'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="text-center pt-2 border-t border-gray-100">
                <Link
                  to={`/product/${product._id || product.slug}`}
                  onClick={onClose}
                  className="text-xs uppercase tracking-widest text-gold-600 hover:text-navy-950 font-semibold underline underline-offset-4"
                >
                  View Full Product Details & Reviews &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
