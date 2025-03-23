import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = "http://localhost:5000/api";

// Configure axios defaults
axios.defaults.baseURL = BASE_URL;
axios.defaults.timeout = 10000; // 10 second timeout

// Add response interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      toast.error("Request timed out. Please check your connection.");
    } else if (!error.response) {
      toast.error("Network error. Please check if the server is running.");
    } else {
      toast.error(
        error.response.data?.message || "An error occurred. Please try again."
      );
    }
    return Promise.reject(error);
  }
);

export const fetchData = async (endpoint) => {
  try {
    const response = await axios.get(`/${endpoint}`);
    return response.data;
  } catch (err) {
    console.error(`Error fetching ${endpoint}:`, err);
    return [];
  }
};

export const createItem = async (endpoint, data) => {
  try {
    const response = await axios.post(`/${endpoint}`, data);
    toast.success("Item added successfully!");
    return response.data;
  } catch (err) {
    console.error("Error adding item:", err);
    throw err;
  }
};

export const updateItem = async (endpoint, id, data) => {
  try {
    const response = await axios.put(`/${endpoint}/${id}`, data);
    toast.success("Item updated successfully!");
    return response.data;
  } catch (err) {
    console.error("Error updating item:", err);
    throw err;
  }
};

export const deleteItem = async (endpoint, id) => {
  try {
    await axios.delete(`/${endpoint}/${id}`);
    toast.success("Item deleted successfully!");
    return true;
  } catch (err) {
    console.error("Error deleting item:", err);
    throw err;
  }
};

export const fetchFilteredData = async (endpoint, filters) => {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "All") params.append(key, value);
    });
    const response = await axios.get(`/${endpoint}?${params}`);
    return response.data;
  } catch (err) {
    console.error("Error filtering data:", err);
    return [];
  }
};
