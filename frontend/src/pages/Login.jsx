import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, Sparkles, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectPath = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate(redirectPath || '/admin');
      } else {
        navigate(redirectPath || '/profile');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdmin = () => {
    setEmail('admin@luxeladies.com');
    setPassword('adminpassword123');
  };

  const handleDemoCustomer = () => {
    setEmail('customer@luxeladies.com');
    setPassword('customerpassword123');
  };

  return (
    <div className="bg-[#FDFBF7] min-h-[85vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-white border border-gold-500/40 p-8 sm:p-10 shadow-luxury relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 border border-gold-500/30 bg-cream-50">
            <Sparkles className="w-3.5 h-3.5 text-gold-500" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-navy-950 font-semibold">
              Client Portal
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-navy-950 mb-2">
            Welcome Back
          </h1>
          <p className="text-xs text-gray-500 font-light">
            Sign in to access your saved orders, wishlist, and private offers.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 text-xs p-3 border border-red-200 mb-6">
            {error}
          </div>
        )}

        {/* Demo Fast Login Buttons */}
        <div className="mb-6 p-4 bg-cream-100 border border-gold-500/30">
          <span className="text-[10px] uppercase tracking-wider text-navy-950 font-bold block mb-2">
            Instant Demo Account Fill:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDemoAdmin}
              className="bg-navy-950 hover:bg-navy-900 text-gold-300 text-[11px] py-1.5 px-2 font-medium flex items-center justify-center gap-1 transition-colors border border-gold-500/30"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
              Fill Admin
            </button>
            <button
              type="button"
              onClick={handleDemoCustomer}
              className="bg-white hover:bg-cream-50 text-navy-950 text-[11px] py-1.5 px-2 font-medium flex items-center justify-center gap-1 transition-colors border border-gray-300"
            >
              <User className="w-3.5 h-3.5 text-navy-900" />
              Fill Customer
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy-950 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full text-xs pl-9 pr-4 py-2.5 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-navy-950">
                Password
              </label>
              <span className="text-[11px] text-gold-600 hover:underline cursor-pointer">
                Forgot Password?
              </span>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs pl-9 pr-4 py-2.5 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gold py-3 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-gold-subtle mt-4"
          >
            {loading ? (
              'Authenticating...'
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-600">
          <span>New to Luxe Ladies? </span>
          <Link to="/register" className="text-gold-600 font-bold hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
