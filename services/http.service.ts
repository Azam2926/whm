import axios from "axios";
import { redirectToLogin } from "@/lib/redirect";
import { toast } from "sonner";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://warehouse-app-l6ug.onrender.com/v1";

const api = axios.create({
  baseURL: `${API_URL}/`,
});

// Request Interceptor
api.interceptors.request.use(
  req => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response Interceptor
api.interceptors.response.use(
  response => response,
  error => {
    const message =
      error.response?.data?.message || error.message || "An error occurred";

    toast.error("Error", {
      description: message,
    });
    console.log(error);
    // Agar foydalanuvchi avtorizatsiya qilinmagan bo'lsa, login sahifasiga yo'naltirish
    if (error.response?.status === 403) {
      redirectToLogin(); // Login sahifasi
    }

    return Promise.reject(error);
  },
);

export default api;
