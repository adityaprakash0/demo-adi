import api from './client.js';

export const searchDonors = async (filters) => {
  const params = new URLSearchParams();

  if (filters.bloodGroup) {
    params.set('bloodGroup', filters.bloodGroup);
  }

  if (filters.location) {
    params.set('location', filters.location);
  }

  const query = params.toString();
  const { data } = await api.get(`/donors${query ? `?${query}` : ''}`);
  return data;
};

export const saveDonorProfile = async (payload) => {
  const { data } = await api.post('/donors', payload);
  return data;
};

export const getDonorById = async (id) => {
  const { data } = await api.get(`/donors/${id}`);
  return data;
};

