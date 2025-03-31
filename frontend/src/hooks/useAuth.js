// frontend/src/hooks/useAuth.js - Authentication hook
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", credentials);
      if (data?.token) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        setUser(data.user);
        return { success: true };
      }
      return { success: false, message: "Invalid response from server" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.status === 401 ? "Invalid username or password" :
          error.response?.status === 400 ? "Please provide valid credentials" :
            "An error occurred during login"
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  }, [navigate]);

  return { user, loading, login, logout, isAuthenticated: () => !!localStorage.getItem("token") };
};

