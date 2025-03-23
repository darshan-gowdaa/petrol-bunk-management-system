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

// Fetch all items
export const fetchData = async (endpoint) => {
  try {
    const response = await axios.get(`/${endpoint}`);
    return response.data;
  } catch (err) {
    console.error("Error fetching data:", err);
    throw err;
  }
};

export const createItem = async (endpoint, data) => {
  try {
    const response = await axios.post(`/${endpoint}`, data);
    return response.data;
  } catch (err) {
    console.error("Error adding item:", err);
    throw err;
  }
};

export const updateItem = async (endpoint, id, data) => {
  try {
    const response = await axios.put(`/${endpoint}/${id}`, data);
    return response.data;
  } catch (err) {
    console.error("Error updating item:", err);
    throw err;
  }
};

export const deleteItem = async (endpoint, id) => {
  try {
    await axios.delete(`/${endpoint}/${id}`);
    return true;
  } catch (err) {
    console.error("Error deleting item:", err);
    throw err;
  }
};

// Fetch filtered data
export const fetchFilteredData = async (endpoint, filters) => {
  try {
    const queryString = Object.entries(filters)
      .filter(([_, value]) => value !== "")
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");

    const response = await axios.get(
      `/${endpoint}/filter${queryString ? `?${queryString}` : ""}`
    );
    return response.data;
  } catch (err) {
    console.error("Error fetching filtered data:", err);
    throw err;
  }
};
