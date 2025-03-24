import axios from "axios";
import { STORAGE_KEYS } from "../constants/constants";
import { toast } from "react-toastify";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    toast.error("Failed to send request. Please try again.", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    });
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error("Session expired. Please login again.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.location.href = "/";
    } else if (error.code === "ECONNABORTED") {
      toast.error("Request timed out. Please check your connection.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    } else if (!error.response) {
      toast.error("Network error. Please check if the server is running.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    } else {
      toast.error(error.response.data?.message || "An error occurred. Please try again.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }
    return Promise.reject(error);
  }
);

export const fetchSales = async () => {
  try {
    const response = await api.get("/sales");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch sales data");
  }
};

export const fetchInventory = async () => {
  try {
    const response = await api.get("/inventory");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch inventory data");
  }
};

export const fetchEmployees = async () => {
  try {
    const response = await api.get("/employees");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch employees data");
  }
};

export const fetchExpenses = async () => {
  try {
    const response = await api.get("/expenses");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch expenses data");
  }
};

export default api;
