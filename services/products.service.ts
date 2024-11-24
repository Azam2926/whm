import api from './http.service';
import {Product} from "@/lib/types";

const productService = {
  getAll: (params: { status: string | undefined; search: string; }) => api.get<{ data: Product[] }>('product/all', {params}),
  getById: (id: number) => api.get(`product/${id}`),
  create: (data: Omit<Product, 'id' | 'created_at'>) => api.post('product/save', {...data, categoryId: data.category_id}),
  delete: (id: number) => api.delete(`product/${id}`),
};

export default productService;
