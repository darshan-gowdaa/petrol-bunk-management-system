import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const LOGIN_ERRORS = {
  400: "Username and password are required.",
  401: "Incorrect username or password. Please try again.",
  403: "Access denied. Your account does not have permission.",
  404: "Auth service not found. Please contact admin.",
  405: "Server configuration error. Please contact admin.",
  429: "Too many login attempts. Please wait a moment.",
  500: "Server error. Please try again in a moment.",
  503: "Server is temporarily down. Please try again shortly.",
};

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
      return { success: false, message: "Unexpected server response. Please try again." };
    } catch (error) {
      const status = error.response?.status;
      const serverMsg = error.response?.data?.message;

      const message =
        serverMsg ||
        LOGIN_ERRORS[status] ||
        (!error.response
          ? "Cannot reach server. Check your internet connection."
          : "Login failed. Please try again.");

      return { success: false, message };
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

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: () => !!localStorage.getItem("token"),
  };
};
