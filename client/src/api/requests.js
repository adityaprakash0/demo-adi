import api from './client.js';

export const createRequest = async (payload) => {
  const { data } = await api.post('/requests', payload);
  return data;
};

export const getMyRequests = async () => {
  const { data } = await api.get('/requests/my');
  return data;
};

export const getOpenRequests = async () => {
  const { data } = await api.get('/requests/open');
  return data;
};

export const updateRequestStatus = async (id, status) => {
  const { data } = await api.patch(`/requests/${id}/status`, { status });
  return data;
};

