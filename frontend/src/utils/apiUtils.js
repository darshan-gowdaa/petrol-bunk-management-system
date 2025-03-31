// frontend/src/utils/apiUtils.js - API utility functions

import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.timeout = 10000;

axios.interceptors.response.use(
  (res) => res,
  (err) => {
    toast.error(
      err.code === "ECONNABORTED"
        ? "Request timed out. Please check your connection."
        : err.response?.data?.message || "An error occurred. Please try again."
    );
    return Promise.reject(err);
  }
);

const apiCall = async (method, endpoint, data) => {
  try {
    const res = await axios[method](`/${endpoint}${data ? `/${data.id || ""}` : ""}`, data);
    return res.data;
  } catch (err) {
    console.error(`Error in ${method} request:`, err);
    throw err;
  }
};

export const fetchData = (endpoint) => apiCall("get", endpoint);
export const createItem = (endpoint, data) => apiCall("post", endpoint, data);
export const updateItem = (endpoint, id, data) => apiCall("put", endpoint, { id, ...data });
export const deleteItem = (endpoint, id) => apiCall("delete", endpoint, { id });

export const fetchFilteredData = async (endpoint, filters) => {
  const queryString = Object.entries(filters)
    .filter(([_, v]) => v && v !== "All")
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");

  return apiCall("get", `${endpoint}${queryString ? `?${queryString}` : ""}`);
};
