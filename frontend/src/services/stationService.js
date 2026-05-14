import api from './api';

export const stationService = {
  getAll: async () => {
    const { data } = await api.get('/stations');
    return data.stations || [];
  },

  getById: async (id) => {
    const { data } = await api.get(`/stations/${id}`);
    return data.station;
  },

  create: async (payload) => {
    const { data } = await api.post('/stations', payload);
    return data.station;
  }
};
