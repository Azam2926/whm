import api from './http.service';
import {Product} from "@/lib/types";

const productService = {
  getAll: (): Promise<{ data: Product[] }> => api.get('products'),
  getById: (id: number) => api.get(`products/${id}`),
  create: (data: Omit<Product, 'id' | 'created_at'>) => api.post('products', data),
  delete: (id: number) => api.delete(`products/${id}`),
};

export default productService;
