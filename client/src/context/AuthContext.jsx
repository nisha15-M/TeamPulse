import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('teampulse_token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            localStorage.removeItem('teampulse_token');
          }
        } catch (err) {
          console.warn('Session expired or invalid:', err.message);
          localStorage.removeItem('teampulse_token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.success) {
        localStorage.setItem('teampulse_token', res.token);
        setUser(res.user);
        return { success: true };
      }
    } catch (err) {
      setAuthError(err.message);
      return { success: false, message: err.message };
    }
  };

  const register = async (userData) => {
    setAuthError(null);
    try {
      const res = await api.post('/auth/register', userData);
      if (res.success) {
        localStorage.setItem('teampulse_token', res.token);
        setUser(res.user);
        return { success: true };
      }
    } catch (err) {
      setAuthError(err.message);
      return { success: false, message: err.message };
    }
  };

  const demoLogin = async (email = 'nishashree@teampulse.io') => {
    return login(email, 'password123');
  };

  const logout = () => {
    localStorage.removeItem('teampulse_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        login,
        register,
        demoLogin,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
