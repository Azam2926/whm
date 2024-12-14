import api from "./http.service";
import { Category } from "@/lib/types";
import { GeneralResponse, GeneralSearchParam } from "@/lib/definitions";

const categoryService = {
  getAll: async (filters?: GeneralSearchParam) =>
    await api.get<GeneralResponse<Category>>("category", {
      params: {
        status: filters?.status === "all" ? undefined : filters?.status,
        search: filters?.search ? filters.search : undefined
      }
    }),
  create: async (data: Partial<Category>) => await api.post("category", data),
  update: async (id: number, category: Partial<Category>) =>
    await api.put(`category/${id}`, category),
  delete: (id: string) => api.delete(`category/${id}`)
};

export default categoryService;
