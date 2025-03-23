import axios from "axios";

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
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("token");
      window.location.href = "/";
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
