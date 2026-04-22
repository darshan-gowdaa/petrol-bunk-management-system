import axios from "axios";
import { STORAGE_KEYS } from "../config/constants";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const toastConfig = {
  position: "bottom-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
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

// URLs where we handle errors manually — skip global toast
const SILENT_URLS = ["/auth/login"];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) return Promise.reject(error);

    const url = error.config?.url || "";
    const isSilent = SILENT_URLS.some((u) => url.includes(u));

    // Auth errors on login — let the login handler show the message
    if (error.response?.status === 401 && isSilent) {
      return Promise.reject(error);
    }

    // Session expired on protected routes
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      toast.error("Your session has expired. Please log in again.", toastConfig);
      return Promise.reject(error);
    }

    // Skip toast for silent routes — they handle their own errors
    if (isSilent) return Promise.reject(error);

    const msg =
      error.code === "ECONNABORTED"
        ? "Request timed out. Please try again."
        : error.response?.status === 503
        ? "Server is temporarily unavailable. Please try again in a moment."
        : error.response?.status === 404
        ? "The requested resource was not found."
        : !error.response
        ? "Network error. Please check your connection."
        : error.response.data?.message || "Something went wrong. Please try again.";

    toast.error(msg, toastConfig);
    return Promise.reject(error);
  }
);

export const fetchSales = () => api.get("/sales").then((r) => r.data);
export const fetchInventory = () => api.get("/inventory").then((r) => r.data);
export const fetchEmployees = () => api.get("/employees").then((r) => r.data);
export const fetchExpenses = () => api.get("/expenses").then((r) => r.data);

export default api;
