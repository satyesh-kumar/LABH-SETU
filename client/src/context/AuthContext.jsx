import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('labhsetu_token'));
  const [loading, setLoading] = useState(true);

  // Load current user profile on mount if token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/me');
        if (data.success) {
          setUser(data.user);
          setProfile(data.profile);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Failed to load user session', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.success) {
      localStorage.setItem('labhsetu_token', data.token);
      setToken(data.token);
      setUser(data.user);
      // Fetch profile
      try {
        const profileRes = await api.get('/profile');
        if (profileRes.data.success) {
          setProfile(profileRes.data.profile);
        }
      } catch (e) {
        console.error('Error fetching profile after login', e);
      }
      return data.user;
    }
  };

  const register = async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    if (data.success) {
      localStorage.setItem('labhsetu_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    }
  };

  const logout = () => {
    localStorage.removeItem('labhsetu_token');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const updateProfileData = async (updates) => {
    const { data } = await api.put('/profile', updates);
    if (data.success) {
      setProfile(data.profile);
      return data.profile;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin' || user?.role === 'superadmin',
        login,
        register,
        logout,
        updateProfileData,
        refreshProfile: async () => {
          const res = await api.get('/profile');
          if (res.data.success) setProfile(res.data.profile);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
