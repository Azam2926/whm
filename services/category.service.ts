import api from "./http.service";
import { Category } from "@/lib/types";

const categoryService = {
  getAll: async (filters?: { status: string | undefined; search: string }) =>
    await api.get<{ sales: Category[]; page: object }>("category", {
      params: {
        status: filters?.status === "all" ? undefined : filters?.status,
        search: filters?.search ? filters.search : undefined
      }
    }),
  create: async (data: Partial<Category>) => await api.post("category", data),
  update: async (id: number, category: Partial<Category>) =>
    await api.put(`category/${id}`, category),
  delete: (id: number) => api.delete(`category/${id}`)
};

export default categoryService;
