import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const Checkout = () => {
  const { cartItems, cartSubtotal, cartTax, cartShipping, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const couponDiscount = location.state?.couponDiscount || 0;
  const finalTotal = Number(Math.max(0, cartTotal - couponDiscount).toFixed(2));

  // Shipping form
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    street: user?.address?.street || '740 Park Avenue',
    city: user?.address?.city || 'New York',
    state: user?.address?.state || 'NY',
    postalCode: user?.address?.postalCode || '10021',
    country: user?.address?.country || 'United States',
    phone: user?.phone || '+1 (555) 234-5678',
  });

  // Payment form
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '•••• •••• •••• 4242',
    cardName: user?.name || 'Sophia Laurent',
    expDate: '12/28',
    cvv: '888',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setError('Your shopping bag is empty.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          image: item.image,
          price: item.price,
          size: item.selectedSize,
          color: item.selectedColor,
          product: item.product,
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice: cartSubtotal,
        taxPrice: cartTax,
        shippingPrice: cartShipping,
        totalPrice: finalTotal,
      };

      const createdOrder = await api.post('/orders', orderData);
      clearCart();
      navigate(`/order-success/${createdOrder._id}`, { state: { order: createdOrder } });
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-[#FDFBF7] min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-serif text-2xl font-bold text-navy-950 mb-3">
          Your Shopping Bag Is Empty
        </h2>
        <p className="text-gray-500 text-xs mb-6">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link to="/shop" className="btn-gold">
          Return to Boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[11px] uppercase tracking-[0.3em] text-gold-600 font-semibold block mb-1">
            Bespoke Checkout
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy-950">
            Secure Haute Couture Order
          </h1>
        </div>

        {error && (
          <div className="max-w-4xl mx-auto bg-red-50 text-red-700 text-xs p-4 border border-red-200 mb-8">
            {error}
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Shipping & Payment */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Shipping Details */}
            <div className="bg-white border border-gray-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 border-b border-gray-200 pb-4 mb-6">
                <div className="w-7 h-7 rounded-full bg-navy-950 text-gold-400 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h3 className="font-serif text-xl font-bold text-navy-950">
                  Shipping Destination
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-navy-950 mb-1">
                    Recipient Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={shippingAddress.fullName}
                    onChange={handleInputChange}
                    className="w-full text-xs px-3.5 py-2.5 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-navy-950 mb-1">
                    Street Address & Suite / Penthouse
                  </label>
                  <input
                    type="text"
                    name="street"
                    required
                    value={shippingAddress.street}
                    onChange={handleInputChange}
                    className="w-full text-xs px-3.5 py-2.5 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-navy-950 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    className="w-full text-xs px-3.5 py-2.5 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-navy-950 mb-1">
                    State / Province
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={shippingAddress.state}
                    onChange={handleInputChange}
                    className="w-full text-xs px-3.5 py-2.5 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-navy-950 mb-1">
                    Postal / Zip Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    value={shippingAddress.postalCode}
                    onChange={handleInputChange}
                    className="w-full text-xs px-3.5 py-2.5 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-navy-950 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    required
                    value={shippingAddress.country}
                    onChange={handleInputChange}
                    className="w-full text-xs px-3.5 py-2.5 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-navy-950 mb-1">
                    Telephone (for Courier Delivery Updates)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={shippingAddress.phone}
                    onChange={handleInputChange}
                    className="w-full text-xs px-3.5 py-2.5 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
                  />
                </div>
              </div>
            </div>

            {/* 2. Payment Method */}
            <div className="bg-white border border-gray-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 border-b border-gray-200 pb-4 mb-6">
                <div className="w-7 h-7 rounded-full bg-navy-950 text-gold-400 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h3 className="font-serif text-xl font-bold text-navy-950">
                  Payment Method
                </h3>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  { id: 'Credit Card', title: 'Credit / Debit Card (Visa, MasterCard, Amex)', icon: CreditCard },
                  { id: 'Cash on Delivery', title: 'White-Glove Cash on Delivery (COD)', icon: Truck },
                  { id: 'PayPal', title: 'PayPal Express Checkout', icon: ShieldCheck },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <label
                      key={item.id}
                      className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${
                        paymentMethod === item.id
                          ? 'border-gold-500 bg-cream-50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={item.id}
                          checked={paymentMethod === item.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="text-gold-600 focus:ring-gold-500"
                        />
                        <span className="text-xs font-semibold text-navy-950">{item.title}</span>
                      </div>
                      <Icon className="w-4 h-4 text-gold-600" />
                    </label>
                  );
                })}
              </div>

              {/* Card input mockup if Credit Card is selected */}
              {paymentMethod === 'Credit Card' && (
                <div className="p-4 bg-navy-950 text-white border border-gold-500/30 space-y-4">
                  <div className="flex justify-between items-center text-xs text-gold-300">
                    <span className="uppercase tracking-widest font-mono">Encrypted Card Terminal</span>
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardDetails.cardNumber}
                      onChange={(e) =>
                        setCardDetails({ ...cardDetails, cardNumber: e.target.value })
                      }
                      className="w-full bg-navy-900 border border-gold-500/20 text-white text-xs px-3 py-2 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">
                        Expires
                      </label>
                      <input
                        type="text"
                        value={cardDetails.expDate}
                        onChange={(e) =>
                          setCardDetails({ ...cardDetails, expDate: e.target.value })
                        }
                        className="w-full bg-navy-900 border border-gold-500/20 text-white text-xs px-3 py-2 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">
                        CVC / CVV
                      </label>
                      <input
                        type="password"
                        value={cardDetails.cvv}
                        onChange={(e) =>
                          setCardDetails({ ...cardDetails, cvv: e.target.value })
                        }
                        className="w-full bg-navy-900 border border-gold-500/20 text-white text-xs px-3 py-2 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Review */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-gray-200 p-6 sm:p-8 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-navy-950 border-b border-gray-200 pb-4 mb-4">
                Selected Pieces ({cartItems.length})
              </h3>

              {/* Items List */}
              <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto pr-1 mb-6">
                {cartItems.map((item) => (
                  <div key={item._id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-14 object-cover border border-gray-200 bg-cream-50"
                      />
                      <div>
                        <p className="font-semibold text-navy-950 line-clamp-1">{item.name}</p>
                        <p className="text-[11px] text-gray-400">
                          {item.selectedSize} · {item.selectedColor} · Qty {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-navy-950">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 space-y-2.5 text-xs text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-navy-950">${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="font-semibold text-navy-950">${cartTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-navy-950">
                    {cartShipping === 0 ? 'Complimentary' : `$${cartShipping.toFixed(2)}`}
                  </span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>VIP Promotion</span>
                    <span>-${couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline">
                  <span className="font-serif text-base font-bold text-navy-950 uppercase tracking-wider">
                    Total Amount
                  </span>
                  <span className="font-serif text-2xl font-bold text-navy-950">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-gold py-4 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-gold-subtle"
              >
                {loading ? (
                  'Authorizing Order...'
                ) : (
                  <>
                    Confirm & Place Order
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="mt-6 space-y-2 text-[11px] text-gray-400 text-center">
                <p>By confirming your order, you agree to the Luxe Ladies Terms of Sale.</p>
                <p>Complimentary 30-day white-glove returns on all orders.</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
