import api from './http.service';
import {Category} from "@/lib/types";

const categoryService = {
    getAll:
        (params: { status: string | undefined; search: string; }) => api.get<{ data: Category[] }>('category/all', {params}),
    create: (data: Omit<Category, 'id' | 'created_at'>) => api.post('category/save', data),
    delete: (id: number) => api.delete(`category/${id}`),
};

export default categoryService;
