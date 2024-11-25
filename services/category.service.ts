import api from './http.service';
import {Category} from "@/lib/types";

const categoryService = {
  getAll:
    (filters?: { status: string | undefined; search: string; }) => api.get<{ data: Category[] }>('category/all',
      {
        params: {
          status: filters?.status === 'all' ? undefined : filters?.status,
          search: filters?.search ? filters.search : undefined,
        }
      }
    ),
  create: (data: Omit<Category, 'id' | 'created_at' | 'createdAt' >) => api.post('category/save', data),
  delete: (id: number) => api.delete(`category/${id}`),
};

export default categoryService;
