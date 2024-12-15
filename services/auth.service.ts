import httpService from "@/services/http.service";

interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    token?: string;
    user?: {
      id: string;
      email: string;
    };
  };
}

interface LoginCredentials {
  email: string;
  password: string;
}

const TOKEN_KEY = "auth_token";

const authService = {
  getToken: async (): Promise<string> => {
    return await httpService.post(
      "https://warehouse-app-l6ug.onrender.com/auth/login",
      {
        email: process.env.NEXT_PUBLIC_API_EMAIL,
        password: process.env.NEXT_PUBLIC_API_PASSWORD
      }
    );
  },

  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await httpService.post(
        "https://warehouse-app-l6ug.onrender.com/auth/login",
        credentials
      );

      if (response.data?.jwt_token) {
        localStorage.setItem(TOKEN_KEY, response.data.jwt_token);
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Login xatosi yuz berdi"
      };
    }
  },

  getStoredToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  logout: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export default authService;
