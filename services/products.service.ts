import api from "./http.service";
import { Product } from "@/lib/types";
import { GeneralResponse, GeneralSearchParam } from "@/lib/definitions";

const productService = {
  getAll: (
    filters?: Partial<
      GeneralSearchParam & {
        category_ids?: number[] | unknown;
      }
    >
  ) => {
    let sortDirection = "DESC";
    let sortBy = "id";

    if (filters?.sorting?.length) {
      sortDirection = filters.sorting[0].desc ? "DESC" : "ASC";
      sortBy = filters?.sorting[0].id;
      if (sortBy === "created_at") sortBy = "createdAt";
    }

    if (filters?.columnFilters?.length) {
      filters.category_ids = filters.columnFilters.find(
        f => f.id === "category"
      )?.value;

      filters.name = filters.columnFilters.find(f => f.id === "name")
        ?.value as string;
    }
    return api.get<GeneralResponse<Product>>("product", {
      params: {
        pageNumber: filters?.page || 1,
        pageSize: filters?.size || 10,
        name: filters?.name,
        category_ids: filters?.category_ids,
        sortDirection,
        sortBy
      },
      paramsSerializer: {
        indexes: null // This prevents adding square brackets to array parameters
      }
    });
  },
  getById: (id: number) => api.get(`product/${id}`),
  create: (data: Omit<Product, "id" | "created_at">) =>
    api.post("product", {
      ...data,
      categoryId: data.category_id
    }),
  update: (id: number, product: Partial<Product>) =>
    api.put(`product/${id}`, { ...product, categoryId: product.category_id }),
  delete: (id: string) => api.delete(`product/${id}`)
};

export default productService;
