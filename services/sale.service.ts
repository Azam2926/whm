import api from './http.service';
import {Sale} from "@/lib/types";

const saleService = {
  getAll: async (filters?: {
    customer_id?: number;
    product_id?: number;
    start_date?: string;
    end_date?: string;
    page?: number;
    size?: number;
  } | undefined) =>
    api.get<{ sales: Sale[]; total_pages: number }>('sale', {params: filters}),
  create: (data: unknown) => api.post('sale', data),
};

export default saleService;
