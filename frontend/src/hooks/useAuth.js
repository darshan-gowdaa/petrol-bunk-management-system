import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { STORAGE_KEYS, ROUTES } from "../constants/constants.js";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      const { token, user: userData } = response.data;

      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
    navigate(ROUTES.LOGIN);
  }, [navigate]);

  const isAuthenticated = useCallback(() => {
    return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
  }, []);

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
  };
};
