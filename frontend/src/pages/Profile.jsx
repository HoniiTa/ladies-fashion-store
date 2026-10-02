import React, { useState, useEffect } from 'react';
import { User, Package, MapPin, CheckCircle, Clock, ShieldCheck, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');

  // Profile fields
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [state, setState] = useState(user?.address?.state || '');
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || '');
  const [country, setCountry] = useState(user?.address?.country || 'United States');
  const [password, setPassword] = useState('');

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Orders
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    api.get('/orders/myorders')
      .then((data) => setOrders(data || []))
      .catch((err) => console.error('Orders error:', err))
      .finally(() => setLoadingOrders(false));
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const payload = {
        name,
        phone,
        address: {
          street,
          city,
          state,
          postalCode,
          country,
        },
      };
      if (password) {
        payload.password = password;
      }
      await updateProfile(payload);
      setMessage('Your client profile has been updated successfully.');
      setPassword('');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Processing':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-navy-950 text-white p-8 sm:p-10 border border-gold-500/30 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-luxury">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full border-2 border-gold-500/50 overflow-hidden bg-navy-900 flex items-center justify-center flex-shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-gold-400" />
              )}
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-gold-400 font-mono">
                Client Profile
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                {user?.name}
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-5 py-2.5 text-xs uppercase tracking-wider font-semibold border transition-all ${
                activeTab === 'orders'
                  ? 'bg-gold-500 text-navy-950 border-gold-500 font-bold'
                  : 'border-gold-500/40 text-gold-200 hover:bg-navy-900'
              }`}
            >
              Order History ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-5 py-2.5 text-xs uppercase tracking-wider font-semibold border transition-all ${
                activeTab === 'profile'
                  ? 'bg-gold-500 text-navy-950 border-gold-500 font-bold'
                  : 'border-gold-500/40 text-gold-200 hover:bg-navy-900'
              }`}
            >
              Client Details
            </button>
          </div>
        </div>

        {/* Tab 1: Orders History */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {loadingOrders ? (
              <div className="py-20 text-center">
                <div className="w-10 h-10 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin mx-auto mb-3" />
                <span className="text-xs text-gray-500 uppercase tracking-widest">
                  Loading Orders...
                </span>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white border border-gray-200 p-12 text-center shadow-sm">
                <Package className="w-10 h-10 text-gold-500 mx-auto mb-3" />
                <h3 className="font-serif text-xl font-bold text-navy-950 mb-1">
                  No Past Orders Found
                </h3>
                <p className="text-xs text-gray-500 mb-6 font-light">
                  You have not placed any orders yet. Discover our collection to begin.
                </p>
                <a href="/shop" className="btn-gold">
                  Explore The Boutique
                </a>
              </div>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord._id}
                  className="bg-white border border-gray-200 shadow-sm overflow-hidden"
                >
                  {/* Order Card Header */}
                  <div className="bg-cream-50 p-4 sm:p-6 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-gray-500 uppercase tracking-wider block">
                        Order Placed:
                      </span>
                      <span className="font-bold text-navy-950">
                        {new Date(ord.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-gray-500 uppercase tracking-wider block">
                        Order ID:
                      </span>
                      <span className="font-mono font-semibold text-navy-950">{ord._id}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-gray-500 uppercase tracking-wider block">
                        Tracking Number:
                      </span>
                      <span className="font-mono font-bold text-gold-700">
                        {ord.trackingNumber}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-gray-500 uppercase tracking-wider block">
                        Total Amount:
                      </span>
                      <span className="font-serif text-sm font-bold text-navy-950">
                        ${ord.totalPrice.toFixed(2)}
                      </span>
                    </div>

                    <div>
                      <span
                        className={`inline-block px-3 py-1 text-[11px] font-semibold tracking-wider uppercase border ${getStatusBadge(
                          ord.orderStatus
                        )}`}
                      >
                        {ord.orderStatus}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4 sm:p-6 divide-y divide-gray-100">
                    {ord.orderItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4 text-xs"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-20 object-cover border border-gold-500/20 bg-cream-50"
                          />
                          <div>
                            <h4 className="font-serif text-sm font-semibold text-navy-950">
                              {item.name}
                            </h4>
                            <p className="text-gray-500 text-[11px] mt-0.5">
                              Size: {item.size} · Color: {item.color} · Qty: {item.quantity}
                            </p>
                          </div>
                        </div>

                        <span className="font-serif text-sm font-bold text-navy-950">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Destination footer */}
                  <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                    <span>
                      Delivering to: {ord.shippingAddress?.fullName}, {ord.shippingAddress?.street},{' '}
                      {ord.shippingAddress?.city}, {ord.shippingAddress?.country}
                    </span>
                    <span>Payment: {ord.paymentMethod}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Profile Settings */}
        {activeTab === 'profile' && (
          <div className="bg-white border border-gray-200 p-8 sm:p-10 shadow-sm max-w-3xl mx-auto">
            <h2 className="font-serif text-2xl font-bold text-navy-950 border-b border-gray-200 pb-4 mb-6">
              Client Profile & Delivery Coordinates
            </h2>

            {message && (
              <div className="bg-emerald-50 text-emerald-800 text-xs p-3 border border-emerald-200 mb-6">
                {message}
              </div>
            )}
            {error && (
              <div className="bg-red-50 text-red-700 text-xs p-3 border border-red-200 mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-navy-950 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-navy-950 mb-1">
                    Telephone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-navy-950 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-navy-950 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-navy-950 mb-1">
                    State / Region
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-navy-950 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-navy-950 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
                />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <label className="block font-semibold uppercase tracking-wider text-navy-950 mb-1">
                  Change Password (Leave blank to keep existing)
                </label>
                <input
                  type="password"
                  placeholder="New password (optional)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="btn-gold py-3 px-8 text-xs font-bold uppercase tracking-wider"
              >
                {saving ? 'Preserving Changes...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
