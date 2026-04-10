import { createContext, useContext, useEffect, useState } from 'react';
import { getProfile, loginUser, signupUser } from '../api/auth.js';

const AuthContext = createContext(null);
const TOKEN_KEY = 'bloodFinderToken';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [donorProfile, setDonorProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const syncProfile = async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setUser(null);
      setDonorProfile(null);
      setLoading(false);
      return;
    }

    try {
      const data = await getProfile();
      setUser(data.user);
      setDonorProfile(data.donorProfile);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      setDonorProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncProfile();
  }, []);

  const saveAuthData = (data) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);
    setDonorProfile(data.donorProfile || null);
  };

  const login = async (payload) => {
    const data = await loginUser(payload);
    saveAuthData(data);
    return data;
  };

  const signup = async (payload) => {
    const data = await signupUser(payload);
    saveAuthData(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setDonorProfile(null);
  };

  const refreshProfile = async () => {
    await syncProfile();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        donorProfile,
        loading,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === 'admin',
        login,
        signup,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

