import api from './http.service';
import {Sale} from "@/lib/types";

const saleService = {
  getAll: async (filters?: {
    customer_id?: number;
    product_id?: number;
    start_date: string;
    end_date: string;
  } | undefined) =>
    api.get<{ sales: Sale[] }>('sale', {params: filters}),
  create: (data: unknown) => api.post('sale', data),
};

export default saleService;
