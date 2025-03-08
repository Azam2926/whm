import api from "./http.service";

const url = "app-config";

const appConfigService = {
  get: async (key: string) => {
    return await api.get<{ id: number; key: string; value: string }>(url, {
      params: { key },
    });
  },
  create: async (data: { key: string; value: string }) =>
    await api.post(url, data),

  update: async (data: { key: string; value: string }) =>
    await api.put(url, data),
};

export default appConfigService;
