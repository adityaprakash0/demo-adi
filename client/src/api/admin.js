import api from './client.js';

export const getAdminOverview = async () => {
  const { data } = await api.get('/admin/overview');
  return data;
};

export const getAdminUsers = async () => {
  const { data } = await api.get('/admin/users');
  return data;
};

export const updateAdminUserRole = async (id, role) => {
  const { data } = await api.patch(`/admin/users/${id}/role`, { role });
  return data;
};

export const deleteAdminUser = async (id) => {
  const { data } = await api.delete(`/admin/users/${id}`);
  return data;
};

export const getAdminDonors = async () => {
  const { data } = await api.get('/admin/donors');
  return data;
};

export const updateAdminDonorAvailability = async (id, availability) => {
  const { data } = await api.patch(`/admin/donors/${id}/availability`, { availability });
  return data;
};

export const deleteAdminDonor = async (id) => {
  const { data } = await api.delete(`/admin/donors/${id}`);
  return data;
};

