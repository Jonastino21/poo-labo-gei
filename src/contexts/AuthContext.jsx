import React, { createContext, useState, useEffect } from 'react';
import { api } from '../config';
import { toast } from 'react-toastify';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('AUTH_TOKEN');
      const savedUser = localStorage.getItem('AUTH_USER');
      
      if (savedToken && savedUser) {
        try {
          // Optionnel: Valider le token avec le backend
          // await api.get('/auth/validate', { headers: { Authorization: `Bearer ${savedToken}` } });
          
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        } catch (err) {
          localStorage.removeItem('AUTH_TOKEN');
          localStorage.removeItem('AUTH_USER');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async ({ email, password }) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      setToken(response.data.token);
      setUser(response.data.user);
      
      localStorage.setItem('AUTH_TOKEN', response.data.token);
      localStorage.setItem('AUTH_USER', JSON.stringify(response.data.user));
      
      toast.success('Connexion réussie !');
      return response.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur de connexion');
      throw err;
    }
  };

  const register = async ({ email, username, password }) => {
    try {
      const response = await api.post('/auth/register', { 
        email, 
        username, 
        password 
      });
      
      // Auto-login après inscription si nécessaire
      setToken(response.data.token);
      setUser(response.data.user);
      
      localStorage.setItem('AUTH_TOKEN', response.data.token);
      localStorage.setItem('AUTH_USER', JSON.stringify(response.data.user));
      
      toast.success('Inscription réussie !');
      return response.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'inscription");
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('AUTH_TOKEN');
    localStorage.removeItem('AUTH_USER');
    toast.info('Vous êtes déconnecté');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        token, 
        user, 
        loading,
        login, 
        logout, 
        register 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};