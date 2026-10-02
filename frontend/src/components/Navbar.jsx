import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop All', path: '/shop' },
    { name: 'Categories', path: '/categories' },
    { name: 'New Arrivals', path: '/shop?category=New%20Arrivals' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-navy-950/95 backdrop-blur-md border-b border-gold-500/20 transition-all duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-gold-300 py-1.5 px-4 text-center text-[11px] font-medium tracking-widest uppercase border-b border-gold-500/10 flex items-center justify-center gap-2">
        <Sparkles className="w-3 h-3 text-gold-400 animate-pulse" />
        <span>Complimentary Express Delivery on orders over $150 &nbsp;|&nbsp; Handcrafted Luxury Fashion</span>
        <Sparkles className="w-3 h-3 text-gold-400 animate-pulse" />
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gold-300 hover:text-gold-400 focus:outline-none p-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex flex-col items-center group">
            <span className="font-serif text-2xl sm:text-3xl tracking-[0.2em] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F4E5BD] via-[#D4AF37] to-[#DFBA73] group-hover:brightness-110 transition-all duration-300">
              LUXE LADIES
            </span>
            <span className="text-[9px] tracking-[0.35em] uppercase text-gold-400/80 -mt-1 font-light">
              Haute Couture
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-xs uppercase tracking-[0.18em] transition-colors duration-200 relative py-1 ${
                    isActive
                      ? 'text-gold-400 font-semibold'
                      : 'text-gray-300 hover:text-gold-300'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-gold-400 to-gold-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            {/* Search Toggle */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-gray-300 hover:text-gold-400 transition-colors p-1"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Search popup bar */}
              {searchOpen && (
                <form
                  onSubmit={handleSearchSubmit}
                  className="absolute right-0 mt-3 w-72 sm:w-80 bg-navy-900 border border-gold-500/40 p-2 shadow-2xl flex items-center z-50 animate-fadeIn"
                >
                  <input
                    type="text"
                    placeholder="Search silk gowns, abayas, jewelry..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-full bg-navy-950 text-white placeholder-gray-400 text-xs px-3 py-2 border border-gold-500/20 focus:outline-none focus:border-gold-500"
                  />
                  <button
                    type="submit"
                    className="ml-2 bg-gold-500 text-navy-950 px-3 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-gold-400"
                  >
                    Go
                  </button>
                </form>
              )}
            </div>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="text-gray-300 hover:text-gold-400 transition-colors relative p-1"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link
              to="/cart"
              className="text-gray-300 hover:text-gold-400 transition-colors relative p-1"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-gold-500 text-navy-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Dropdown */}
            <div className="relative">
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-1.5 text-gray-300 hover:text-gold-400 focus:outline-none"
                  >
                    <div className="w-7 h-7 rounded-full border border-gold-500/50 overflow-hidden bg-navy-800 flex items-center justify-center">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-gold-400" />
                      )}
                    </div>
                    <ChevronDown className="w-3 h-3 text-gold-400" />
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-3 w-52 bg-navy-900 border border-gold-500/40 shadow-2xl py-2 z-50 text-xs"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-gold-500/20">
                        <p className="font-serif text-sm font-semibold text-gold-200">
                          {user.name}
                        </p>
                        <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 bg-gold-500/20 text-gold-400 px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold rounded">
                            Store Admin
                          </span>
                        )}
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-2.5 text-gold-300 hover:bg-navy-800 transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4 mr-2.5 text-gold-400" />
                          Admin Dashboard
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-gray-300 hover:bg-navy-800 hover:text-gold-300 transition-colors"
                      >
                        <User className="w-4 h-4 mr-2.5 text-gold-400" />
                        My Profile & Orders
                      </Link>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                          navigate('/login');
                        }}
                        className="w-full text-left flex items-center px-4 py-2 text-red-400 hover:bg-navy-800 transition-colors border-t border-gold-500/10 mt-1"
                      >
                        <LogOut className="w-4 h-4 mr-2.5" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="text-xs uppercase tracking-widest text-gold-300 hover:text-gold-400 font-medium"
                  >
                    Login
                  </Link>
                  <span className="text-gold-500/40">|</span>
                  <Link
                    to="/register"
                    className="hidden sm:inline-block text-xs uppercase tracking-widest text-gray-300 hover:text-white font-medium"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-navy-950 border-b border-gold-500/30 px-6 py-6 space-y-4 animate-fadeIn">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm uppercase tracking-widest text-gray-200 hover:text-gold-400 py-2 border-b border-navy-800"
              >
                {link.name}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm uppercase tracking-widest text-gold-400 py-2 flex items-center gap-2 border-b border-navy-800"
              >
                <ShieldCheck className="w-4 h-4" /> Admin Portal
              </Link>
            )}
            {!isAuthenticated ? (
              <div className="pt-2 flex flex-col space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-gold text-center py-2.5"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-navy text-center py-2.5"
                >
                  Create Account
                </Link>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                  navigate('/login');
                }}
                className="text-left text-sm uppercase tracking-widest text-red-400 py-2"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
