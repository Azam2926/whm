import axios from "axios";
import { toast } from "@/hooks/use-toast";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://warehouse-app-l6ug.onrender.com/v1";

const api = axios.create({
  baseURL: `${API_URL}/`
});

api.interceptors.response.use(
  response => response,
  error => {
    const message =
      error.response?.data?.message || error.message || "An error occurred";

    toast({
      variant: "destructive",
      title: "Error",
      description: message
    });

    return Promise.reject(error);
  }
);
export default api;
