import api from './http.service';

const productService = {
  getById: (id: number) => api.get(`/v1/product/${id}`),
  getAll: () => api.get('/v1/product/all'),
  create: (data: unknown) => api.post('/v1/product/save', data),
  update: (id: number, data: unknown) => api.put(`/v1/product/${id}`, data),
  delete: (id: number) => api.delete(`/v1/product/${id}`),
};

export default productService;
