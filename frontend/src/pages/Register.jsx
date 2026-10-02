import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Phone, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(name, email, password, phone);
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FDFBF7] min-h-[85vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-white border border-gold-500/40 p-8 sm:p-10 shadow-luxury relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 border border-gold-500/30 bg-cream-50">
            <Sparkles className="w-3.5 h-3.5 text-gold-500" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-navy-950 font-semibold">
              The Salon Register
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-navy-950 mb-2">
            Create An Account
          </h1>
          <p className="text-xs text-gray-500 font-light">
            Enjoy priority order tracking, concierge assistance, and private invitations.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 text-xs p-3 border border-red-200 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy-950 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Lady Genevieve"
                className="w-full text-xs pl-9 pr-4 py-2.5 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
              />
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

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
                placeholder="genevieve@example.com"
                className="w-full text-xs pl-9 pr-4 py-2.5 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy-950 mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full text-xs pl-9 pr-4 py-2.5 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
              />
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy-950 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full text-xs pl-9 pr-4 py-2.5 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy-950 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
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
              'Creating Account...'
            ) : (
              <>
                Complete Registration
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-600">
          <span>Already registered? </span>
          <Link to="/login" className="text-gold-600 font-bold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
