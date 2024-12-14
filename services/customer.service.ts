import api from "./http.service";
import { Customer } from "@/lib/types";

const customerService = {
  getAll: (filters?: { status: string | undefined; search: string }) =>
    api.get<{ data: Customer[]; page: object }>("customer", {
      params: {
        status: filters?.status === "all" ? undefined : filters?.status,
        search: filters?.search ? filters.search : undefined
      }
    }),
  create: (data: Omit<Customer, "id" | "created_at">) =>
    api.post("customer", data),
  update: (id: number, product: Partial<Customer>) =>
    api.put(`customer/${id}`, product),
  delete: (id: number) => api.delete(`customer/${id}`)
};

export default customerService;
