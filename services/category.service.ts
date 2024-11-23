import api from './http.service';
import {Category} from "@/lib/types";

const categoryService = {
  getAll: (params: { status: string | undefined; search: string; }): Promise<{ data: {data: Category[]} }> => api.get('category/all'),
  getById: (id: number) => api.get(`category/${id}`),
  create: (data: Omit<Category, 'id' | 'created_at'>) => api.post('category/save', data),
  delete: (id: number) => api.delete(`category/${id}`),
};

export default categoryService;
