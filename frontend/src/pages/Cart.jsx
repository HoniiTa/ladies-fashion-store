import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Sparkles, Tag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartTax,
    cartShipping,
    cartTotal,
  } = useCart();

  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [couponError, setCouponError] = useState('');

  const freeShippingThreshold = 150;
  const progressToFreeShipping = Math.min(
    100,
    (cartSubtotal / freeShippingThreshold) * 100
  );
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'LUXE10') {
      const discount = Number((cartSubtotal * 0.1).toFixed(2));
      setCouponDiscount(discount);
      setCouponMessage('VIP 10% Couture Discount Applied!');
      setCouponError('');
    } else {
      setCouponError('Invalid invitation code. Try LUXE10');
      setCouponMessage('');
    }
  };

  const finalTotal = Number(
    Math.max(0, cartTotal - couponDiscount).toFixed(2)
  );

  if (cartItems.length === 0) {
    return (
      <div className="bg-[#FDFBF7] min-h-[75vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-cream-100 border border-gold-500/30 flex items-center justify-center mb-6 text-gold-600">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-navy-950 mb-3">
          Your Shopping Bag Is Empty
        </h2>
        <p className="text-gray-500 text-xs sm:text-sm max-w-md mx-auto mb-8 font-light">
          Your wardrobe awaits the finest creations. Discover our new arrivals, embroidered abayas,
          and silk evening gowns.
        </p>
        <Link to="/shop" className="btn-gold flex items-center gap-2">
          Explore The Boutique
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[11px] uppercase tracking-[0.3em] text-gold-600 font-semibold block mb-1">
            Review Your Selections
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy-950">
            Shopping Bag ({cartItems.length} {cartItems.length === 1 ? 'Creation' : 'Creations'})
          </h1>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="bg-white border border-gold-500/30 p-4 mb-8 shadow-sm max-w-3xl mx-auto">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-navy-950">
              {amountNeededForFreeShipping > 0
                ? `Add $${amountNeededForFreeShipping.toFixed(2)} more for Complimentary Express Delivery`
                : '✨ You have unlocked Complimentary Express Delivery!'}
            </span>
            <span className="text-gold-600">{progressToFreeShipping.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-gold-400 to-gold-600 h-full transition-all duration-500"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-gray-200 divide-y divide-gray-100 shadow-sm">
              {cartItems.map((item) => (
                <div key={item._id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                  <div className="flex gap-4 items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-24 object-cover border border-gold-500/20 bg-cream-50 flex-shrink-0"
                    />
                    <div>
                      <Link
                        to={`/product/${item.product}`}
                        className="font-serif text-base font-semibold text-navy-950 hover:text-gold-600 transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <div className="text-xs text-gray-500 mt-1 space-x-3">
                        <span>Size: <strong className="text-navy-900">{item.selectedSize}</strong></span>
                        <span>Color: <strong className="text-navy-900">{item.selectedColor}</strong></span>
                      </div>
                      <div className="mt-2 text-xs font-semibold text-navy-950">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Item Subtotal */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    <div className="flex items-center border border-gray-300">
                      <button
                        onClick={() =>
                          updateQuantity(item.product, item.selectedSize, item.selectedColor, item.quantity - 1)
                        }
                        className="px-2.5 py-1 text-xs hover:bg-gray-100 font-bold"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product, item.selectedSize, item.selectedColor, item.quantity + 1)
                        }
                        className="px-2.5 py-1 text-xs hover:bg-gray-100 font-bold"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-serif text-base font-bold text-navy-950 w-20 text-right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>

                    <button
                      onClick={() =>
                        removeFromCart(item.product, item.selectedSize, item.selectedColor, item._id)
                      }
                      className="text-gray-400 hover:text-red-600 transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2">
              <Link
                to="/shop"
                className="text-xs uppercase tracking-widest text-gold-600 hover:text-navy-950 font-semibold"
              >
                &larr; Continue Browsing
              </Link>
              <button
                onClick={clearCart}
                className="text-xs text-red-600 hover:text-red-800 tracking-wider uppercase font-semibold"
              >
                Clear Entire Bag
              </button>
            </div>
          </div>

          {/* Order Summary Column */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 p-6 sm:p-8 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-navy-950 border-b border-gray-200 pb-4 mb-4">
                Order Summary
              </h3>

              <div className="space-y-3 text-xs mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-navy-950">${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-semibold text-navy-950">${cartTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Express Courier Delivery</span>
                  <span className="font-semibold text-navy-950">
                    {cartShipping === 0 ? (
                      <span className="text-emerald-700 font-bold">COMPLIMENTARY</span>
                    ) : (
                      `$${cartShipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold border-t border-dashed border-gray-200 pt-2">
                    <span>VIP Promotion (10%)</span>
                    <span>-${couponDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4 flex justify-between items-baseline">
                  <span className="font-serif text-base font-bold text-navy-950 uppercase tracking-wider">
                    Total
                  </span>
                  <span className="font-serif text-2xl font-bold text-navy-950">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Promo code form */}
              <form onSubmit={handleApplyCoupon} className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code (LUXE10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full text-xs uppercase px-3 py-2 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
                  />
                  <button
                    type="submit"
                    className="bg-navy-900 text-gold-300 hover:bg-gold-500 hover:text-navy-950 px-4 py-2 text-xs uppercase font-bold tracking-wider transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <p className="text-[11px] text-emerald-700 mt-2 font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" /> {couponMessage}
                  </p>
                )}
                {couponError && (
                  <p className="text-[11px] text-red-600 mt-2 font-medium">{couponError}</p>
                )}
              </form>

              <button
                onClick={() => navigate('/checkout', { state: { couponDiscount } })}
                className="w-full btn-gold py-4 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-gold-subtle"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-gray-500 text-center">
                <ShieldCheck className="w-4 h-4 text-gold-600" />
                <span>Encrypted 256-Bit SSL Checkout Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
