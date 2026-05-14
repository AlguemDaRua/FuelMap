import api from './api';

export const fuelService = {
  getByStation: async (stationId) => {
    const { data } = await api.get(`/fuels/station/${stationId}`);
    return data.fuels || [];
  },

  updateStock: async (fuelId, payload) => {
    const { data } = await api.put(`/fuels/${fuelId}`, payload);
    return data.fuel;
  },

  addFuel: async (payload) => {
    const { data } = await api.post('/fuels', payload);
    return data.fuels;
  }
};
