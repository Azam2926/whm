import api from './http.service';

const customerService = {
  getById: (id: number) => api.get(`/v1/customer/${id}`),
  create: (data: unknown) => api.post('/v1/customer/save', data),
};

export default customerService;
