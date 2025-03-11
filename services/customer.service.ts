import api from "./http.service";
import { Customer } from "@/lib/types";
import { GeneralResponse, GeneralSearchParam } from "@/lib/definitions";

const customerService = {
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

    return await api.get<GeneralResponse<Customer>>("customer", {
      params: {
        pageNumber: filters?.page || 1,
        pageSize: filters?.size || 100,
        name: filters?.name,
        status: filters?.status,
        sortDirection,
        sortBy
      }
    });
  },
  create: (data: Omit<Customer, "id" | "created_at">) =>
    api.post("customer", data),
  update: (id: number, product: Partial<Customer>) =>
    api.put(`customer/${id}`, product),
  delete: (id: string) => api.delete(`customer/${id}`)
};

export default customerService;
