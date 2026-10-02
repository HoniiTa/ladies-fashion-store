import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('luxe_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync with local storage
  useEffect(() => {
    localStorage.setItem('luxe_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // If user logs in, fetch backend cart if exists
  useEffect(() => {
    if (isAuthenticated) {
      api.get('/users/cart')
        .then((backendCart) => {
          if (backendCart && backendCart.length > 0) {
            // map backend cart format to UI format
            const formatted = backendCart.map((item) => ({
              _id: item._id,
              product: item.product._id || item.product,
              name: item.product.name,
              price: item.product.discountPrice || item.product.price,
              originalPrice: item.product.price,
              image: item.product.coverImage,
              quantity: item.quantity,
              selectedSize: item.selectedSize,
              selectedColor: item.selectedColor,
              countInStock: item.product.countInStock,
            }));
            setCartItems(formatted);
          }
        })
        .catch((err) => console.log('Cart fetch notice:', err.message));
    }
  }, [isAuthenticated]);

  const addToCart = async (product, quantity = 1, size = 'M', color = 'Navy') => {
    const existingIndex = cartItems.findIndex(
      (item) =>
        item.product === (product._id || product.product) &&
        item.selectedSize === size &&
        item.selectedColor === color
    );

    let updatedCart;
    if (existingIndex > -1) {
      updatedCart = cartItems.map((item, idx) =>
        idx === existingIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      const newItem = {
        _id: 'cart_' + Date.now() + Math.random().toString(36).substr(2, 4),
        product: product._id || product.product,
        name: product.name,
        price: product.discountPrice || product.price,
        originalPrice: product.price,
        image: product.coverImage || (product.images && product.images[0]),
        quantity: Number(quantity),
        selectedSize: size,
        selectedColor: color,
        countInStock: product.countInStock || 10,
      };
      updatedCart = [...cartItems, newItem];
    }

    setCartItems(updatedCart);

    // If logged in, also sync to backend
    if (isAuthenticated) {
      try {
        await api.post('/users/cart', {
          productId: product._id || product.product,
          quantity,
          selectedSize: size,
          selectedColor: color,
        });
      } catch (err) {
        console.error('Failed to sync cart item with backend:', err);
      }
    }
  };

  const updateQuantity = (productId, size, color, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.product === productId &&
        item.selectedSize === size &&
        item.selectedColor === color
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = async (productId, size, color, cartId) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product === productId &&
            item.selectedSize === size &&
            item.selectedColor === color
          )
      )
    );

    if (isAuthenticated && cartId && !cartId.startsWith('cart_')) {
      try {
        await api.delete(`/users/cart/${cartId}`);
      } catch (err) {
        console.error('Failed to delete cart item on backend:', err);
      }
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    if (isAuthenticated) {
      try {
        await api.delete('/users/cart');
      } catch (err) {
        console.error('Failed to clear cart on backend:', err);
      }
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = Number(
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)
  );
  const cartTax = Number((cartSubtotal * 0.08).toFixed(2));
  const cartShipping = cartSubtotal >= 150 || cartSubtotal === 0 ? 0 : 15.0;
  const cartTotal = Number((cartSubtotal + cartTax + cartShipping).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        cartTax,
        cartShipping,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
