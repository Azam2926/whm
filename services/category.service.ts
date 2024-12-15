import api from "./http.service";
import { Category } from "@/lib/types";
import { GeneralResponse, GeneralSearchParam } from "@/lib/definitions";

const categoryService = {
  getAll: async (
    filters?: Partial<GeneralSearchParam> & {
      status?: string;
    }
  ) => {
    let sortDirection = "DESC";
    let sortBy = "id";

    if (filters?.sorting?.length) {
      sortDirection = filters.sorting[0].desc ? "DESC" : "ASC";
      sortBy = filters?.sorting[0].id;
      if (sortBy === "created_at") sortBy = "createdAt";
    }

    if (filters?.columnFilters?.length) {
      const statusFilter = filters.columnFilters.find(f => f.id === "status");
      if (statusFilter)
        filters.status = (statusFilter?.value as Array<string>)[0];

      const nameFilter = filters.columnFilters.find(f => f.id === "name");
      filters.name = nameFilter?.value as string;
    }

    return await api.get<GeneralResponse<Category>>("category", {
      params: {
        pageNumber: filters?.page || 1,
        pageSize: filters?.size || 10,
        name: filters?.name,
        status: filters?.status,
        sortDirection,
        sortBy
      }
    });
  },
  create: async (data: Partial<Category>) => await api.post("category", data),
  update: async (id: number, category: Partial<Category>) =>
    await api.put(`category/${id}`, category),
  delete: (id: string) => api.delete(`category/${id}`)
};

export default categoryService;
