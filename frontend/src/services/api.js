import axios from "axios";
import { STORAGE_KEYS } from "../constants/constants";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const toastConfig = {
  position: "bottom-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      return Promise.reject(error);
    }

    // Don't show toast for cancelled requests
    if (axios.isCancel(error)) return Promise.reject(error);

    const errorMessage =
      error.code === "ECONNABORTED"
        ? "Request timed out. Please try again."
        : error.response?.status === 503
        ? "Server is temporarily unavailable. Please try again shortly."
        : !error.response
        ? "Network error. Please check your connection."
        : error.response.data?.message || "An error occurred. Please try again.";

    toast.error(errorMessage, toastConfig);
    return Promise.reject(error);
  }
);

export const fetchSales = () => api.get("/sales").then((r) => r.data);
export const fetchInventory = () => api.get("/inventory").then((r) => r.data);
export const fetchEmployees = () => api.get("/employees").then((r) => r.data);
export const fetchExpenses = () => api.get("/expenses").then((r) => r.data);

export default api;
