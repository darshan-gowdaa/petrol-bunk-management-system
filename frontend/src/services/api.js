// frontend/src/services/api.js - API service layer
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
  timeout: 10000, //10sec
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

    const errorMessage = error.code === "ECONNABORTED"
      ? "Request timed out. Please check your connection."
      : !error.response
        ? "Network error. Please check if the server is running."
        : error.response.data?.message || "An error occurred. Please try again.";

    toast.error(errorMessage, toastConfig);
    return Promise.reject(error);
  }
);

export const fetchSales = () => api.get("/sales").then(response => response.data);
export const fetchInventory = () => api.get("/inventory").then(response => response.data);
export const fetchEmployees = () => api.get("/employees").then(response => response.data);
export const fetchExpenses = () => api.get("/expenses").then(response => response.data);

export default api;

