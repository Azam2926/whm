import api from "./http.service";
import { Product } from "@/lib/types";

const productService = {
  getAll: (params?: { search: string | undefined }) =>
    api.get<{ sales: Product[]; page: object }>("product", {
      params
    }),
  getById: (id: number) => api.get(`product/${id}`),
  create: (data: Omit<Product, "id" | "created_at">) =>
    api.post("product", {
      ...data,
      categoryId: data.category_id
    }),
  update: (id: number, product: Partial<Product>) =>
    api.put(`product/${id}`, { ...product, categoryId: product.category_id }),
  delete: (id: number) => api.delete(`product/${id}`)
};

export default productService;
