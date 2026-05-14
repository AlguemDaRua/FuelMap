import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(() => localStorage.getItem('fuelmap_token'));
  const [isLoading, setIsLoading] = useState(true);

  // Ao montar, se há token guardado, valida e carrega o user
  useEffect(() => {
    const init = async () => {
      const saved = localStorage.getItem('fuelmap_token');
      if (saved) {
        try {
          const { user: me } = await authService.getMe();
          setUser(me);
          setToken(saved);
        } catch {
          localStorage.removeItem('fuelmap_token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    init();
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password);
    localStorage.setItem('fuelmap_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await authService.register(payload);
    localStorage.setItem('fuelmap_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('fuelmap_token');
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
};
