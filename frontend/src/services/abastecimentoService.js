import api from './api';

export const abastecimentoService = {
  create: async (payload) => {
    const { data } = await api.post('/abastecimento', payload);
    return data;
  },

  getByStation: async (stationId) => {
    const { data } = await api.get(`/abastecimento/station/${stationId}`);
    return data.records || [];
  },

  getAll: async () => {
    const { data } = await api.get('/abastecimento');
    return data.records || [];
  }
};
