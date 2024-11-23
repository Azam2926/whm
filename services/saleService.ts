import api from './http.service';

const saleService = {
  create: (data: unknown) => api.post('/v1/sale/save', data),
};

export default saleService;
