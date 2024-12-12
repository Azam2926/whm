import httpService from "@/services/http.service";

const authService = {
  getToken: async (): Promise<string> => {
    return await httpService.post(
      "https://warehouse-app-l6ug.onrender.com/auth/login",
      {
        email: process.env.NEXT_PUBLIC_API_EMAIL,
        password: process.env.NEXT_PUBLIC_API_PASSWORD
      }
    );
  }
};
