import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('luxe_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('luxe_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Load from backend when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      api.get('/users/wishlist')
        .then((items) => {
          if (items) setWishlist(items);
        })
        .catch((err) => console.log('Wishlist fetch notice:', err.message));
    }
  }, [isAuthenticated]);

  const toggleWishlist = async (product) => {
    const productId = product._id || product.product;
    const exists = wishlist.some((item) => (item._id || item.product) === productId);

    let updated;
    if (exists) {
      updated = wishlist.filter((item) => (item._id || item.product) !== productId);
    } else {
      updated = [...wishlist, product];
    }
    setWishlist(updated);

    if (isAuthenticated) {
      try {
        const res = await api.post('/users/wishlist/toggle', { productId });
        if (res.wishlist) {
          setWishlist(res.wishlist);
        }
      } catch (err) {
        console.error('Wishlist sync error:', err);
      }
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item._id || item.product) === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
