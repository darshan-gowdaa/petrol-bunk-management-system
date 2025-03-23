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
      const response = await api.post("/auth/login", credentials);

      if (response.data && response.data.token) {
        const { user, token } = response.data;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        setUser(user);
        return { success: true };
      }

      return {
        success: false,
        message: "Invalid response from server",
      };
    } catch (error) {
      if (error.response?.status === 401) {
        return {
          success: false,
          message: "Invalid username or password",
        };
      }
      if (error.response?.status === 400) {
        return {
          success: false,
          message: "Please provide valid credentials",
        };
      }
      return {
        success: false,
        message: "An error occurred during login",
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

  const isAuthenticated = useCallback(() => {
    return !!localStorage.getItem("token");
  }, []);

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
  };
};
