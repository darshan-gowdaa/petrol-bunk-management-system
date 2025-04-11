// frontend/src/utils/toastConfig.js - Toast configuration

import { toast } from "react-toastify";

export const toastConfig = {
    position: "bottom-right",
    theme: "dark",
    autoClose: 3000,
    hideProgressBar: false,
    newestOnTop: false,
    closeOnClick: true,
    rtl: false,
    pauseOnFocusLoss: true,
    draggable: true,
    pauseOnHover: true
};

export const showToast = {
    success: (message) => toast.success(message, toastConfig),
    error: (message) => toast.error(message, toastConfig),
    info: (message) => toast.info(message, toastConfig),
    warning: (message) => toast.warning(message, toastConfig),
}; 
