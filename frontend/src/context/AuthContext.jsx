import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('luxe_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('luxe_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const freshUser = await api.get('/auth/me');
          setUser(freshUser);
          localStorage.setItem('luxe_user', JSON.stringify(freshUser));
        } catch (err) {
          console.error('Session expired or invalid:', err);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    const data = await api.post('/auth/login', { email, password });
    setUser(data);
    setToken(data.token);
    localStorage.setItem('luxe_user', JSON.stringify(data));
    localStorage.setItem('luxe_token', data.token);
    return data;
  };

  const register = async (name, email, password, phone) => {
    const data = await api.post('/auth/register', { name, email, password, phone });
    setUser(data);
    setToken(data.token);
    localStorage.setItem('luxe_user', JSON.stringify(data));
    localStorage.setItem('luxe_token', data.token);
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('luxe_user');
    localStorage.removeItem('luxe_token');
  };

  const updateProfile = async (profileData) => {
    const updated = await api.put('/auth/profile', profileData);
    setUser(updated);
    localStorage.setItem('luxe_user', JSON.stringify(updated));
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
