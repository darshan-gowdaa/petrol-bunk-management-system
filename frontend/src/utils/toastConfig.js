// frontend/src/utils/toastConfig.js - Toast configuration

import { toast } from "react-toastify";

export const toastConfig = {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
};

export const showToast = {
    success: (message) => toast.success(message, toastConfig),
    error: (message) => toast.error(message, toastConfig),
    info: (message) => toast.info(message, toastConfig),
    warning: (message) => toast.warning(message, toastConfig),
}; 
