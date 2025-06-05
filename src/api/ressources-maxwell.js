
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const axiosInstance = axios.create({
  baseURL: API_BASE,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('AUTH_TOKEN');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchResources = async () => {
  const response = await axiosInstance.get('/resources');
  return response.data;
};

export const createResource = async (resourcePayload) => {
  const response = await axiosInstance.post('/resources', resourcePayload);
  return response.data;
};

export const updateResource = async (id, resourcePayload) => {
  const response = await axiosInstance.put(`/resources/${id}`, resourcePayload);
  return response.data;
};

export const deleteResource = async (id) => {
  const response = await axiosInstance.delete(`/resources/${id}`);
  return response.data;
};

export const fetchUsageHistory = async (id) => {
  const response = await axiosInstance.get(`/resources/${id}/history`);
  return response.data;
};
