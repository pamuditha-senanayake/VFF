import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mocking behavior for demo
api.interceptors.request.use((config) => {
  // Add token here if needed
  return config;
});

export default api;
