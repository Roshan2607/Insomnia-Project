import axios from 'axios';

const BASE_URL = 'http://192.168.68.109:8000';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

export const checkHealth = () => api.get('/health');
export const predict = (payload) => api.post('/predict', payload);
export const getFeatures = () => api.get('/features');